import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import tripsRouter from './routes/trips.js';
import destinationsRouter from './routes/destinations.js';
import itemsRouter from './routes/items.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth Middleware: Provide scoped Supabase Client using the user's token
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // If no token (unauthorized), we'll let it pass but requests might fail RLS
    // or we can import default client, but relying on request client is standardized.
    const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder_key';
    req.supabase = createClient(supabaseUrl, supabaseKey);
    return next();
  }
  
  const token = authHeader.split(' ')[1];
  const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder_key';
  
  req.supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  
  // also extract user so we can manually assign user_id to new entries
  req.supabase.auth.getUser(token).then(({ data: { user } }) => {
    req.user = user;
    next();
  }).catch(() => next());
});

// Routes
app.use('/api/trips', tripsRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/items', itemsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
