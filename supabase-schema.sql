-- SQL Script to set up tables in Supabase

-- 1. Trips Table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'Planning Phase',
    budget NUMERIC DEFAULT 0,
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Destinations Table
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    budget NUMERIC DEFAULT 0,
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Items Table (Activities and local transportation within a destination)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('activity', 'transportation')),
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    budget NUMERIC DEFAULT 0,
    duration NUMERIC DEFAULT 0,
    duration_unit TEXT,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Transportations Between Destinations
CREATE TABLE transportations_between_destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    from_destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    to_destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'transportation',
    title TEXT NOT NULL,
    description TEXT,
    budget NUMERIC DEFAULT 0,
    duration NUMERIC DEFAULT 0,
    duration_unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (temporarily allowing all for ease of development)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportations_between_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on trips" ON trips FOR ALL USING (true);
CREATE POLICY "Allow all on destinations" ON destinations FOR ALL USING (true);
CREATE POLICY "Allow all on items" ON items FOR ALL USING (true);
CREATE POLICY "Allow all on transportations_between_destinations" ON transportations_between_destinations FOR ALL USING (true);
