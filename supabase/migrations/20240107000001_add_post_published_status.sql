-- Add published column to posts table
ALTER TABLE posts ADD COLUMN published BOOLEAN DEFAULT false;

-- Add updated_at column for tracking post edits
ALTER TABLE posts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();

-- Update existing posts to be published (assuming they should be visible)
UPDATE posts SET published = true WHERE published IS NULL;

-- Update RLS policy to only show published posts to the public (optional - you can remove this if you want all posts visible)
DROP POLICY IF EXISTS "Public posts are viewable by everyone." ON posts;

CREATE POLICY "Published posts are viewable by everyone."
ON posts FOR SELECT
USING ( published = true );

-- Allow admins to see all posts (including drafts) 
CREATE POLICY "Admins can view all posts."
ON posts FOR SELECT
USING ( 
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);