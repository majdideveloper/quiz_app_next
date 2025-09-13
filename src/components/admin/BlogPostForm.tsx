'use client'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Post } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Save, X, FileText, Tag, Globe, Eye, Loader2 } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import BlogImageUpload from '../blog/BlogImageUpload'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().optional(),
  published: z.boolean().optional().default(false), // Optional since we're not storing it yet
})

type FormValues = z.infer<typeof formSchema>

interface BlogPostFormProps {
  post?: Post
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      category: post?.category || '',
      image_url: post?.image_url || '',
      published: post?.published ?? false,
    },
  })

  // Auto-generate slug from title
  const title = watch('title')
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true)

    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        alert('You must be logged in to create or update a post.')
        setIsSubmitting(false)
        return
      }

      // Exclude published field since it doesn't exist in database yet
      const { published, ...dataWithoutPublished } = data
      const postData = { 
        ...dataWithoutPublished, 
        author_id: user.id
      }

      if (post) {
        // Update post
        const { error } = await supabase.from('posts').update(postData).eq('id', post.id)
        if (error) {
          console.error('Failed to update post:', error)
          alert('Error updating post: ' + error.message)
        } else {
          router.push('/admin/blog')
        }
      } else {
        // Create post
        const { error } = await supabase.from('posts').insert(postData)
        if (error) {
          console.error('Failed to create post:', error)
          alert('Error creating post: ' + error.message)
        } else {
          router.push('/admin/blog')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An unexpected error occurred')
    }

    setIsSubmitting(false)
  }

  const handleImageUpload = (imageUrl: string) => {
    setValue('image_url', imageUrl, { shouldDirty: true })
  }

  const handleImageRemove = () => {
    setValue('image_url', '', { shouldDirty: true })
  }

  const categories = [
    'Technology',
    'Business', 
    'Health',
    'Education',
    'Lifestyle',
    'News',
    'Other'
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {post ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <p className="text-sm text-gray-500">
                {post ? 'Update your existing blog post' : 'Write and publish a new blog post'}
              </p>
            </div>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        {/* Title and Slug Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              onChange={(e) => {
                register('title').onChange(e)
                // Auto-generate slug if it's empty or matches the previous title
                const currentSlug = watch('slug')
                if (!currentSlug || currentSlug === generateSlug(title)) {
                  setValue('slug', generateSlug(e.target.value))
                }
              }}
              placeholder="Enter a compelling title for your blog post"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              placeholder="url-friendly-slug"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.slug.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              This will be the URL: /blog/{watch('slug') || 'your-slug'}
            </p>
          </div>
        </div>

        {/* Category Section */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            <Tag className="w-4 h-4 inline mr-2" />
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Featured Image Section */}
        <div className="space-y-4">
          <BlogImageUpload
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            currentImage={watch('image_url')}
            label="Featured Image"
          />
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write your blog post content here. You can use Markdown formatting."
                  rows={20}
                />
              )}
            />
          </div>
          {errors.content && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Publishing Note */}
        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-900">Publishing Status</h3>
          </div>
          <p className="text-sm text-blue-800">
            All blog posts are currently published and publicly visible once created.
          </p>
          <p className="text-xs text-blue-600">
            Draft functionality will be available after the next system update.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {post ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
