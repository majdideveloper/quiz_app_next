-- Add explanation field to questions table
ALTER TABLE questions 
ADD COLUMN explanation TEXT;

-- Add explanation_visible field to control when explanations are shown
ALTER TABLE questions 
ADD COLUMN explanation_visible BOOLEAN DEFAULT true;