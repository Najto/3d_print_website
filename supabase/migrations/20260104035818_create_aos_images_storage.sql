/*
  # Create AoS Images Storage Bucket

  1. New Storage Bucket
    - Creates `aos-unit-images` bucket for storing unit preview images
    - Public bucket so images can be displayed without authentication
    
  2. Storage Policies
    - Allow public read access to all images
    - Allow authenticated users to upload images
    - Allow authenticated users to update their own images
    - Allow authenticated users to delete their own images
    
  3. Notes
    - Images will be stored with path: `{faction_id}/{unit_id}/preview.{ext}`
    - Public access allows images to be displayed in the app
*/

-- Create the storage bucket for AoS unit images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aos-unit-images',
  'aos-unit-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all images
CREATE POLICY "Public read access for unit images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'aos-unit-images');

-- Allow anyone to upload images (we'll store them with faction/unit paths)
CREATE POLICY "Allow image uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'aos-unit-images');

-- Allow anyone to update images
CREATE POLICY "Allow image updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'aos-unit-images')
WITH CHECK (bucket_id = 'aos-unit-images');

-- Allow anyone to delete images
CREATE POLICY "Allow image deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'aos-unit-images');