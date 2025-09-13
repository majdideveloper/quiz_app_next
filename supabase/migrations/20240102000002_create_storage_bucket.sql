-- Create storage bucket for quiz assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-assets', 'quiz-assets', true);

-- Set up RLS policies for the storage bucket
CREATE POLICY "Public read access for quiz assets" ON storage.objects
FOR SELECT USING (bucket_id = 'quiz-assets');

CREATE POLICY "Authenticated users can upload quiz assets" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'quiz-assets' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'quiz-assets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'quiz-assets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);