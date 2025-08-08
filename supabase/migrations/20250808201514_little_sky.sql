/*
  # Hotel Management System Database Schema

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `type` (text) - individual, doble, familiar
      - `name` (text)
      - `price` (numeric)
      - `description` (text)
      - `features` (jsonb)
      - `image` (text)
      - `available` (boolean)
      - `created_at` (timestamp)

    - `reservations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `room_id` (uuid, foreign key to rooms)
      - `guest_name` (text)
      - `email` (text)
      - `phone` (text)
      - `check_in` (date)
      - `check_out` (date)
      - `guests` (integer)
      - `total_price` (numeric)
      - `status` (text) - pending, confirmed, cancelled
      - `created_at` (timestamp)

    - `gallery_images`
      - `id` (uuid, primary key)
      - `src` (text)
      - `alt` (text)
      - `category` (text)
      - `created_at` (timestamp)

    - `user_profiles`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `full_name` (text)
      - `role` (text) - client, admin
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only policies for management operations
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('individual', 'doble', 'familiar')),
  name text NOT NULL,
  price numeric NOT NULL,
  description text NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  image text NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  src text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policies for rooms (public read, admin write)
CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage rooms"
  ON rooms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Policies for reservations
CREATE POLICY "Users can view own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Policies for gallery_images (public read)
CREATE POLICY "Anyone can view gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO rooms (type, name, price, description, features, image) VALUES
('individual', 'Habitación Individual Deluxe', 80, 'Cómoda habitación individual con todas las comodidades necesarias para un huésped.', 
 '["Cama individual", "WiFi gratuito", "TV HD", "Minibar", "Aire acondicionado", "Baño privado"]', 
 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'),
('doble', 'Habitación Doble Premium', 120, 'Espaciosa habitación doble perfecta para parejas o viajeros de negocios.', 
 '["Cama doble", "WiFi gratuito", "TV HD", "Minibar", "Aire acondicionado", "Baño privado", "Balcón"]', 
 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'),
('familiar', 'Suite Familiar', 180, 'Amplia suite familiar con espacio para toda la familia y comodidades adicionales.', 
 '["2 camas dobles", "Sofá cama", "WiFi gratuito", "TV HD", "Minibar", "Aire acondicionado", "Baño privado", "Sala de estar", "Balcón"]', 
 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg');

INSERT INTO gallery_images (src, alt, category) VALUES
('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 'Lobby del hotel', 'Instalaciones'),
('https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg', 'Restaurante', 'Gastronomía'),
('https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', 'Piscina', 'Instalaciones'),
('https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 'Habitación premium', 'Habitaciones'),
('https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg', 'Spa', 'Instalaciones'),
('https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', 'Vista exterior', 'Exterior');

-- Create admin user profile (this will be created when admin signs up)
-- The admin user needs to be created through the auth system first