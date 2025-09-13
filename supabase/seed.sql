-- Insert test users into auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
), (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'employee@example.com',
    crypt('employee123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Employee User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Update the auto-created profiles with role and department
UPDATE public.profiles SET 
    role = 'admin',
    department = 'IT Department'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE public.profiles SET 
    role = 'employee',
    department = 'Human Resources'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Insert sample courses
INSERT INTO public.courses (id, title, description, content, category, created_by, is_published) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'Workplace Safety Training',
    'Essential workplace safety protocols and procedures for Canadian employees.',
    'This comprehensive course covers all aspects of workplace safety...',
    'Safety',
    '11111111-1111-1111-1111-111111111111',
    true
),
(
    '44444444-4444-4444-4444-444444444444',
    'Privacy and Data Protection',
    'Understanding Canadian privacy laws and data protection requirements.',
    'Learn about PIPEDA and provincial privacy legislation...',
    'Compliance',
    '11111111-1111-1111-1111-111111111111',
    true
),
(
    '55555555-5555-5555-5555-555555555555',
    'Harassment Prevention',
    'Creating a respectful workplace free from harassment and discrimination.',
    'This course covers prevention strategies and reporting procedures...',
    'HR',
    '11111111-1111-1111-1111-111111111111',
    false
);

-- Insert sample quizzes
INSERT INTO public.quizzes (id, course_id, title, description, time_limit, passing_score, max_attempts, created_by, is_published) VALUES
(
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    'Safety Knowledge Check',
    'Test your understanding of workplace safety protocols.',
    30,
    80,
    3,
    '11111111-1111-1111-1111-111111111111',
    true
),
(
    '77777777-7777-7777-7777-777777777777',
    '44444444-4444-4444-4444-444444444444',
    'Privacy Law Quiz',
    'Assess your knowledge of Canadian privacy legislation.',
    45,
    75,
    2,
    '11111111-1111-1111-1111-111111111111',
    true
);

-- Insert sample questions for Safety Quiz
INSERT INTO public.questions (quiz_id, question_text, question_type, options, correct_answer, points, order_index, image_url) VALUES
(
    '66666666-6666-6666-6666-666666666666',
    'What is the first step in case of a fire emergency?',
    'multiple_choice',
    '["Sound the alarm", "Evacuate immediately", "Call 911", "Find a fire extinguisher"]',
    'Sound the alarm',
    1,
    1,
    null
),
(
    '66666666-6666-6666-6666-666666666666',
    'Personal Protective Equipment (PPE) is mandatory in all work areas.',
    'true_false',
    null,
    'false',
    1,
    2,
    null
),
(
    '66666666-6666-6666-6666-666666666666',
    'Complete this safety motto: "Safety _____, accidents cost."',
    'fill_in_blank',
    null,
    'pays',
    1,
    3,
    null
);

-- Insert sample questions for Privacy Quiz
INSERT INTO public.questions (quiz_id, question_text, question_type, options, correct_answer, points, order_index, image_url) VALUES
(
    '77777777-7777-7777-7777-777777777777',
    'Which federal privacy law applies to private sector organizations in Canada?',
    'multiple_choice',
    '["PIPEDA", "FOIP", "PIPA", "Privacy Act"]',
    'PIPEDA',
    2,
    1,
    null
),
(
    '77777777-7777-7777-7777-777777777777',
    'Organizations must obtain consent before collecting personal information.',
    'true_false',
    null,
    'true',
    1,
    2,
    null
);

-- Insert sample course enrollments
INSERT INTO public.course_enrollments (user_id, course_id, progress_percentage) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    100
),
(
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    60
);

-- Insert sample quiz attempts
INSERT INTO public.quiz_attempts (user_id, quiz_id, answers, score, completed_at, time_taken) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    '66666666-6666-6666-6666-666666666666',
    '{"1": "Sound the alarm", "2": "false", "3": "pays"}',
    100,
    NOW() - INTERVAL '2 days',
    1420
),
(
    '22222222-2222-2222-2222-222222222222',
    '77777777-7777-7777-7777-777777777777',
    '{"1": "PIPEDA", "2": "true"}',
    100,
    NOW() - INTERVAL '1 day',
        '1680'
);

-- Insert sample blog posts
INSERT INTO public.posts (title, content, slug, author_id, category, image_url) VALUES
(
    'Welcome to Our New Blog!',
    '<p>This is the first post on our new blog. We are excited to share news, updates, and insights with you.</p><p>Our blog will feature articles on workplace safety, privacy laws, employee training, and much more. Stay tuned for regular updates!</p>',
    'welcome-to-our-new-blog',
    '11111111-1111-1111-1111-111111111111',
    'News',
    null
),
(
    'The Importance of Workplace Safety',
    '<p>Workplace safety is a critical component of a healthy and productive work environment. In this post, we will discuss the key elements of a successful safety program.</p><h2>Key Safety Elements</h2><ul><li>Regular safety training</li><li>Proper equipment maintenance</li><li>Emergency procedures</li><li>Risk assessments</li></ul><p>By implementing these elements, organizations can create a safer workplace for all employees.</p>',
    'importance-of-workplace-safety',
    '11111111-1111-1111-1111-111111111111',
    'Safety',
    null
),
(
    'Understanding Canadian Privacy Laws',
    '<p>In this post, we provide an overview of the key privacy laws in Canada, including PIPEDA, and what they mean for your business.</p><h2>PIPEDA Overview</h2><p>The Personal Information Protection and Electronic Documents Act (PIPEDA) is Canada''s federal privacy law for the private sector.</p><h2>Key Requirements</h2><ul><li>Obtain consent for collection</li><li>Limit use and disclosure</li><li>Ensure accuracy of information</li><li>Provide access to individuals</li></ul>',
    'understanding-canadian-privacy-laws',
    '11111111-1111-1111-1111-111111111111',
    'Compliance',
    null
),
(
    'Cybersecurity Best Practices for Employees',
    '<p>In today''s digital workplace, cybersecurity is everyone''s responsibility. This comprehensive guide covers essential security practices every employee should follow.</p><h2>Password Security</h2><p>Strong passwords are your first line of defense against cyber threats. Follow these guidelines:</p><ul><li>Use unique passwords for each account</li><li>Include uppercase, lowercase, numbers, and symbols</li><li>Use a password manager</li><li>Enable two-factor authentication</li></ul><h2>Email Security</h2><p>Email is a common attack vector. Be vigilant about:</p><ul><li>Phishing attempts</li><li>Suspicious attachments</li><li>Unverified senders</li><li>Social engineering tactics</li></ul><h2>Safe Browsing</h2><p>When browsing the internet at work:</p><ul><li>Avoid suspicious websites</li><li>Keep software updated</li><li>Use secure Wi-Fi connections</li><li>Report security incidents immediately</li></ul><p>Remember: cybersecurity is a team effort. When in doubt, ask your IT department for guidance.</p>',
    'security',
    '11111111-1111-1111-1111-111111111111',
    'Technology',
    null
);