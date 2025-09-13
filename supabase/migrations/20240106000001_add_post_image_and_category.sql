ALTER TABLE public.posts
ADD COLUMN image_url TEXT,
ADD COLUMN category TEXT;

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog_images', 'blog_images', true);

CREATE POLICY "Public access for blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog_images');

CREATE POLICY "Admins can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog_images' AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
));
