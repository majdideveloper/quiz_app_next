# 🧠 Claude Code System Prompt

## Project Overview

You're helping me build a Canadian employee quiz app using Next.js (App Router), Supabase for auth/storage/db, and Tailwind CSS for styling. The goal is to let administrators create courses and quizzes for employee training, while users can take quizzes, track progress, and earn certificates for Canadian workplace compliance and skill development.

We'll start with an MVP that includes:
1. **Admin dashboard** with course/quiz creation
2. **Supabase auth** with role-based access (admin/employee)  
3. **Quiz management** UI with multiple question types
4. **Employee interface** for taking quizzes and viewing courses
5. **Progress tracking** and certificate generation
6. **Mock analytics** dashboard (basic reporting for now)

Please suggest code in small, testable steps. Include file paths, explain where to place new code, and keep Tailwind classes concise. Use good architecture (e.g., modular components, folders for utils/api). When I give you a command like "add admin login" or "create quiz interface," you can scaffold the necessary files or modify existing ones.

---

## 🚀 Kickoff Instructions (what to say in Claude)

**Start with:**

Let's set up the base of the app:
• Next.js App Router with TypeScript
• Supabase project connection (auth + database + storage)
• Tailwind CSS configured  
• Add a components/, lib/, types/, and app/ folder structure
• Set up Supabase auth with email sign-in and role-based access
• Add route protection for admin vs employee access
• Basic layout components and navigation structure

**Then follow up with:**

After that, let's implement the database foundation:
• Create Supabase tables: users, courses, quizzes, questions, quiz_attempts, enrollments
• Set up Row Level Security (RLS) policies for admin/employee access
• Create database helper functions and TypeScript types
• Build authentication context and hooks
• Add user role management and session handling

**Finally, let's build the core features:**

Then we'll implement the main functionality:
• **Admin Dashboard**: Course creation, quiz builder with  questions
• **Quiz Interface**: Timer, question navigation, auto-save answers
• **Employee Dashboard**: Course catalog, progress tracking, certificates
• **Analytics**: Basic reporting for admins (quiz scores, completion rates)
• **Canadian Compliance**: Bilingual support, accessibility features

---

## 🎯 Key Requirements

### Database Schema (Supabase Tables)
```sql
-- Users table (extends Supabase auth.users)
profiles: id, email, full_name, role, department, created_at, updated_at

-- Courses table
courses: id, title, description, content, category, created_by, is_published, created_at

-- Quizzes table  
quizzes: id, course_id, title, description, time_limit, passing_score, max_attempts, created_by, is_published

-- Questions table
questions: id, quiz_id, question_text, question_type, options, correct_answer, points, order_index

-- Quiz attempts table
quiz_attempts: id, user_id, quiz_id, answers, score, started_at, completed_at, time_taken

-- Course enrollments table
course_enrollments: id, user_id, course_id, enrolled_at, completed_at, progress_percentage
```

### App Structure
```
/src
  /app
    /admin
      /dashboard          # Admin overview
      /courses           # Course management  
      /quizzes           # Quiz creation
      /users             # User management
      /analytics         # Reports
    /auth
      /login             # Authentication
      /register          # User signup
    /courses
      /[courseId]        # Course details
    /quizzes  
      /[quizId]          # Quiz taking interface
    /dashboard           # Employee dashboard
    /profile             # User settings
  /components
    /admin               # Admin-specific components
    /quiz                # Quiz-related components  
    /course              # Course components
    /ui                  # Reusable UI components
  /lib
    /supabase           # Supabase client & helpers
    /auth               # Authentication utilities
    /utils              # General utilities  
  /types                # TypeScript definitions
  /hooks                # Custom React hooks
```

### Core Features to Implement

**Authentication & Authorization:**
- Supabase Auth with email/password
- Role-based route protection (admin/employee)
- User profile management
- Session persistence

**Admin Dashboard:**
- Course CRUD operations with rich text editor
- Quiz builder with multiple question types (MCQ, True/False, Fill-in-blank)
- User management and role assignment
- Analytics dashboard with charts
- Bulk import/export functionality

**Employee Interface:**
- Course catalog with search and filtering
- Quiz taking interface with timer and progress
- Personal dashboard showing progress and certificates
- Mobile-responsive design

**Canadian Compliance:**
- English/French language toggle
- WCAG 2.1 accessibility standards
- Privacy policy and data handling
- Certificate generation for compliance training

### Tech Stack Details

**Frontend:**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for form handling
- Lucide React for icons

**Backend:**
- Supabase for database, auth, and storage
- Row Level Security for data protection
- Real-time subscriptions for live updates
- Edge functions for complex operations

**Development:**
- Local Supabase instance
- TypeScript strict mode
- ESLint + Prettier for code quality
- Component-driven development

---

## 💡 Implementation Approach

Start with the foundation (auth + database), then build admin features, followed by the employee experience. Each step should be fully functional before moving to the next.

**Phase 1:** Project setup + authentication
**Phase 2:** Database schema + admin dashboard
**Phase 3:** Quiz creation and management
**Phase 4:** Employee quiz-taking interface  
**Phase 5:** Analytics and reporting
**Phase 6:** Canadian compliance features

Ready to begin? Just say "set up the project foundation" or "create the admin dashboard" and I'll provide step-by-step code with file paths and explanations.