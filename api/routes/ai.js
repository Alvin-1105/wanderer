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
    const { messages } = req.body;
    
    const formattedMessages = messages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction: SYSTEM_PROMPT,
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
  "coverImage": "MUST be exactly: https://loremflickr.com/1200/800/{keyword1},{keyword2}/all (replace keywords with 2-3 single-word tags representing the destination, separated by commas, NO SPACES OR UNDERSCORES)",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "budget": number (total planned budget),
  "destinations": [
    {
      "city": "City name",
      "country": "Country name",
      "description": "Why this city is chosen",
      "coverImage": "MUST be exactly: https://loremflickr.com/1000/600/{city_name},{landmark}/all (single words only, separated by commas, NO SPACES)",
      "budget": number,
      "duration": number (number of days to stay here),
      "items": [
        {
          "type": "activity",
          "title": "Activity name",
          "description": "Engaging description",
          "image": "MUST be exactly: https://loremflickr.com/800/500/{activity_theme},{city}/all (single words only, separated by commas, NO SPACES)",
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

export default router;
