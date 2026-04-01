-- SQL Script to upgrade tables for Multi-User Auth in Supabase

-- Add user_id to all tables
ALTER TABLE trips ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE destinations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE items ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE transportations_between_destinations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing highly permissive policies
DROP POLICY IF EXISTS "Allow all on trips" ON trips;
DROP POLICY IF EXISTS "Allow all on destinations" ON destinations;
DROP POLICY IF EXISTS "Allow all on items" ON items;
DROP POLICY IF EXISTS "Allow all on transportations_between_destinations" ON transportations_between_destinations;

-- Create Secure Row Level Security (RLS) Policies bounds to auth.uid()
CREATE POLICY "Users can only select their own trips" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own trips" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own trips" ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own trips" ON trips FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own destinations" ON destinations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own items" ON items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own transportations" ON transportations_between_destinations FOR ALL USING (auth.uid() = user_id);
