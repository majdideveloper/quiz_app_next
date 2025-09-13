-- Add image_url column to questions table
ALTER TABLE public.questions 
ADD COLUMN image_url TEXT;