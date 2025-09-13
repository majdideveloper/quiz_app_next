import { supabase } from '@/lib/supabase/client'

export async function uploadQuestionImage(file: File, questionId: string): Promise<string | null> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${questionId}-${Date.now()}.${fileExt}`
    const filePath = `question-images/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('quiz-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('quiz-assets')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteQuestionImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `question-images/${fileName}`

    const { error } = await supabase.storage
      .from('quiz-assets')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

export async function uploadBlogImage(file: File, blogId: string): Promise<string | null> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${blogId}-${Date.now()}.${fileExt}`
    const filePath = `blog-images/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('quiz-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('quiz-assets')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading blog image:', error)
    return null
  }
}

export async function deleteBlogImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `blog-images/${fileName}`

    const { error } = await supabase.storage
      .from('quiz-assets')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting blog image:', error)
    return false
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file size must be less than 5MB'
    }
  }

  return { valid: true }
}