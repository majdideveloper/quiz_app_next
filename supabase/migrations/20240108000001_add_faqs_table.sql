-- Create faqs table
CREATE TABLE public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    question_fr TEXT,
    answer_fr TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on faqs table
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can read published FAQs
CREATE POLICY "Published FAQs are viewable by everyone" ON public.faqs
    FOR SELECT USING (is_published = true);

-- RLS Policy: Only admins can create FAQs
CREATE POLICY "Only admins can create FAQs" ON public.faqs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policy: Only admins can update FAQs
CREATE POLICY "Only admins can update FAQs" ON public.faqs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policy: Only admins can delete FAQs
CREATE POLICY "Only admins can delete FAQs" ON public.faqs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policy: Admins can view all FAQs (including unpublished)
CREATE POLICY "Admins can view all FAQs" ON public.faqs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add updated_at trigger to faqs table
CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_faqs_published_order ON public.faqs (is_published, order_index) WHERE is_published = true;
CREATE INDEX idx_faqs_created_by ON public.faqs (created_by);

-- FAQs can be added through the admin interface after users are created