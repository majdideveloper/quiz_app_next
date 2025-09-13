export type UserRole = 'admin' | 'employee'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  department: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  content: string
  category: string
  created_by: string
  is_published: boolean
  created_at: string
}

export interface Quiz {
  id: string
  course_id: string
  title: string
  description: string
  time_limit: number | null
  passing_score: number
  max_attempts: number
  created_by: string
  is_published: boolean
  created_at: string
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_in_blank'

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  question_type: QuestionType
  options: string[] | null
  correct_answer: string
  points: number
  order_index: number
  image_url?: string | null
  explanation?: string | null
  explanation_visible?: boolean
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  answers: Record<string, string>
  score: number | null
  started_at: string
  completed_at: string | null
  time_taken: number | null
}

export interface CourseEnrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
  progress_percentage: number
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at?: string;
  author_id: string;
  image_url?: string;
  category?: string;
  published?: boolean;
}