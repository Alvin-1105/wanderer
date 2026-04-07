import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Role: You are a professional AI travel assistant specialized in personalized travel planning.

Objective: Your goal is to generate personalized, realistic, and well-structured travel recommendations by integrating user motivations, cultural background, budget, and time constraints.

Core Framework:
1. Push & Pull Motivation Matching - Identify internal travel motivations and match with destination attributes.
2. Cultural Distance Adaptation - Recommend culturally similar or diverse destinations based on user tolerance.
3. Practical Constraints (MANDATORY) - Ensure recommendations fit budget and travel duration.

Interaction Process:
Ask concise follow-up questions to determine: Travel motivation, Budget range, Travel duration, Cultural preference, Interests.
IMPORTANT RULE 1: Do NOT ask all questions at once. Ask one or two questions at a time in a conversational, friendly, and professional tone.
IMPORTANT RULE 2: Once you have gathered enough information to generate a complete and personalized trip, you MUST output the exact text "[ACTION: GENERATE_TRIP]" at the very END of your final confirmation message. Do not include this phrase until you are ready to stop chatting and build the trip.
`;

router.post('/chat', async (req, res) => {
  try {
    const { messages, contextTrip } = req.body;
    
    const formattedMessages = messages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    let dynamicPrompt = SYSTEM_PROMPT;
    if (contextTrip) {
      dynamicPrompt += `\n\nIMPORTANT COPILOT CONTEXT:\nThe user is currently viewing/editing an existing trip. Here is the JSON of their current trip. Base all your advice on this structure:\n${JSON.stringify(contextTrip)}\n\nIMPORTANT RULE 3: If the user asks to modify, add, or change something in this trip, converse with them to confirm the details. ONCE YOU AND THE USER HAVE AGREED ON THE MODIFICATIONS, you MUST output the exact text "[ACTION: UPDATE_TRIP]" at the very END of your final confirmation message.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction: dynamicPrompt,
        temperature: 0.7,
      }
    });

    res.json({ message: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI' });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // We append a final prompt asking for strict JSON
    const jsonPrompt = `
You have completed the consultation. 
Based on the conversation history, generate a comprehensive travel trip plan. 
You MUST return ONLY valid JSON matching this exact structure:
{
  "title": "A catchy title for the trip",
  "description": "A rich, enthusiastic overview of the entire trip, explaining WHY it matches the user's motivation, cultural distance, and budget.",
  "coverImage": "MUST be exactly: https://tse1.mm.bing.net/th?q=tourist+attraction+{keyword1}+{keyword2}&w=1200&h=800&c=7 (replace keywords with core destination names, e.g. Eiffel+Tower+Paris, use + instead of spaces)",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "budget": number (total planned budget),
  "destinations": [
    {
      "city": "City name",
      "country": "Country name",
      "description": "Why this city is chosen",
      "coverImage": "MUST be exactly: https://tse1.mm.bing.net/th?q=famous+landmark+{landmark}+in+{city_name}&w=1000&h=600&c=7 (e.g. famous+landmark+Louvre+in+Paris, use + instead of spaces)",
      "budget": number,
      "duration": number (number of days to stay here),
      "items": [
        {
          "type": "activity",
          "title": "Activity name",
          "description": "Engaging description",
          "image": "MUST be exactly: https://tse1.mm.bing.net/th?q=travel+photography+of+{specific_activity}+at+{city}&w=800&h=500&c=7 (e.g. travel+photography+of+Cafe+at+Paris, use + instead of spaces)",
          "budget": number,
          "duration": number,
          "durationUnit": "Hours",
          "category": "Food/Nature/History/etc"
        }
      ]
    }
  ]
}
DO NOT wrap the JSON in Markdown code blocks like \`\`\`json. Just return the raw JSON object. Use realistic verifiable places. DO NOT leave trailing commas or comments in the JSON.
`;

    const formattedMessages = messages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    formattedMessages.push({ role: 'user', parts: [{ text: jsonPrompt }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        temperature: 0.2, 
      }
    });

    let rawJson = response.text.trim();
    if (rawJson.startsWith('\`\`\`')) {
      rawJson = rawJson.replace(/^\`\`\`json\n?/, '').replace(/\`\`\`$/, '').trim();
    }
    
    const tripData = JSON.parse(rawJson);

    // Save to Database
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Calculate trip duration natively based on dates
    const startObj = new Date(tripData.startDate);
    const endObj = new Date(tripData.endDate);
    const tripDurationDays = Math.max(1, Math.ceil((endObj - startObj) / (1000 * 60 * 60 * 24)) + 1);

    const tripInsert = {
      title: tripData.title,
      description: tripData.description,
      cover_image: tripData.coverImage,
      start_date: tripData.startDate,
      end_date: tripData.endDate,
      duration: tripDurationDays,
      budget: tripData.budget || 0,
      status: 'Planning Phase',
      user_id: userId
    };

    const { data: tripDoc, error: tripError } = await req.supabase
      .from('trips')
      .insert([tripInsert])
      .select()
      .single();

    if (tripError) throw tripError;

    if (tripData.destinations && tripData.destinations.length > 0) {
      for (let d of tripData.destinations) {
        const destInsert = {
          trip_id: tripDoc.id,
          city: d.city,
          country: d.country,
          description: d.description,
          cover_image: d.coverImage,
          duration: d.duration || 1,
          budget: d.budget || 0,
          user_id: userId
        };
        const { data: destDoc, error: destError } = await req.supabase
          .from('destinations')
          .insert([destInsert])
          .select()
          .single();
          
        if (!destError && d.items && d.items.length > 0) {
          const itemsInsert = d.items.map((i, index) => ({
            destination_id: destDoc.id,
            type: i.type || 'activity',
            title: i.title,
            description: i.description,
            image: i.image,
            budget: i.budget || 0,
            duration: i.duration || 1,
            duration_unit: i.durationUnit || 'Hours',
            category: i.category,
            order_index: index,
            user_id: userId
          }));
          await req.supabase.from('items').insert(itemsInsert);
        }
      }
    }

    res.json(tripDoc);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate trip' });
  }
});

router.post('/update_trip', async (req, res) => {
  try {
    const { messages, tripId } = req.body;
    
    // We append a final prompt asking for strict JSON
    const jsonPrompt = `
You have completed the consultation. 
Based on the conversation history AND the existing trip context, generate the FULLY UPDATED travel trip plan. Include everything from the original trip that wasn't modified, and apply the new changes. 
You MUST return ONLY valid JSON matching this exact structure:
{
  "title": "A catchy title for the trip",
  "description": "A rich, enthusiastic overview of the entire trip",
  "coverImage": "MUST be exactly: https://tse1.mm.bing.net/th?q=tourist+attraction+{keyword1}+{keyword2}&w=1200&h=800&c=7",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "budget": number,
  "destinations": [
    {
      "city": "City name",
      "country": "Country name",
      "description": "Why this city is chosen",
      "coverImage": "MUST be exactly: https://tse1.mm.bing.net/th?q=famous+landmark+{landmark}+in+{city_name}&w=1000&h=600&c=7",
      "budget": number,
      "duration": number,
      "items": [
        {
          "type": "activity",
          "title": "Activity name",
          "description": "Engaging description",
          "image": "MUST be exactly: https://tse1.mm.bing.net/th?q=travel+photography+of+{specific_activity}+at+{city}&w=800&h=500&c=7",
          "budget": number,
          "duration": number,
          "durationUnit": "Hours",
          "category": "Food/Nature/History/etc"
        }
      ]
    }
  ]
}
DO NOT wrap the JSON in Markdown code blocks like \`\`\`json. Just return the raw JSON object.
`;

    const formattedMessages = messages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    formattedMessages.push({ role: 'user', parts: [{ text: jsonPrompt }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        temperature: 0.2, 
      }
    });

    let rawJson = response.text.trim();
    if (rawJson.startsWith('\`\`\`')) {
      rawJson = rawJson.replace(/^\`\`\`json\n?/, '').replace(/\`\`\`$/, '').trim();
    }
    
    const tripData = JSON.parse(rawJson);

    // Save to Database
    const userId = req.user?.id;
    if (!userId || !tripId) {
      return res.status(401).json({ error: 'Unauthorized or Missing Trip ID' });
    }

    const startObj = new Date(tripData.startDate);
    const endObj = new Date(tripData.endDate);
    const tripDurationDays = Math.max(1, Math.ceil((endObj - startObj) / (1000 * 60 * 60 * 24)) + 1);

    const tripUpdate = {
      title: tripData.title,
      description: tripData.description,
      cover_image: tripData.coverImage,
      start_date: tripData.startDate,
      end_date: tripData.endDate,
      duration: tripDurationDays,
      budget: tripData.budget || 0,
    };

    // 1. Update Trip Parent
    const { data: tripDoc, error: tripError } = await req.supabase
      .from('trips')
      .update(tripUpdate)
      .eq('id', tripId)
      .eq('user_id', userId)
      .select()
      .single();

    if (tripError) throw tripError;

    // 2. Delete existing destinations (cascades to items if foreign keys are set up, but we'll try to delete manually just in case cascading isn't reliable, though Supabase usually cascades).
    // Actually, simple cascade setup allows deleting destinations to clear items.
    const { error: deleteError } = await req.supabase
      .from('destinations')
      .delete()
      .eq('trip_id', tripId);
      
    if (deleteError) throw deleteError;

    // 3. Re-insert the new nested structure
    if (tripData.destinations && tripData.destinations.length > 0) {
      for (let d of tripData.destinations) {
        const destInsert = {
          trip_id: tripId,
          city: d.city,
          country: d.country,
          description: d.description,
          cover_image: d.coverImage,
          duration: d.duration || 1,
          budget: d.budget || 0,
          user_id: userId
        };
        const { data: destDoc, error: destError } = await req.supabase
          .from('destinations')
          .insert([destInsert])
          .select()
          .single();
          
        if (!destError && d.items && d.items.length > 0) {
          const itemsInsert = d.items.map((i, index) => ({
            destination_id: destDoc.id,
            type: i.type || 'activity',
            title: i.title,
            description: i.description,
            image: i.image,
            budget: i.budget || 0,
            duration: i.duration || 1,
            duration_unit: i.durationUnit || 'Hours',
            category: i.category,
            order_index: index,
            user_id: userId
          }));
          await req.supabase.from('items').insert(itemsInsert);
        }
      }
    }

    res.json(tripDoc);
  } catch (error) {
    console.error('Update via AI error:', error);
    res.status(500).json({ error: 'Failed to update trip via AI' });
  }
});

export default router;
