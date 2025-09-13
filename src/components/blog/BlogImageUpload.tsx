'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image, AlertCircle, Loader2 } from 'lucide-react'
import { uploadBlogImage, deleteBlogImage, validateImageFile } from '@/lib/utils/imageUpload'

interface BlogImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  onImageRemove?: () => void
  currentImage?: string
  className?: string
  label?: string
  required?: boolean
}

export default function BlogImageUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  className = '',
  label = 'Featured Image',
  required = false
}: BlogImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    setError(null)
    setUploadProgress(0)

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setIsUploading(true)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const imageUrl = await uploadBlogImage(file, `blog-${Date.now()}`)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (imageUrl) {
        onImageUpload(imageUrl)
        setError(null)
      } else {
        setError('Failed to upload image. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async () => {
    if (currentImage && onImageRemove) {
      try {
        await deleteBlogImage(currentImage)
        onImageRemove()
      } catch (error) {
        console.error('Error removing image:', error)
        setError('Failed to remove image')
      }
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Current Image Preview */}
      {currentImage && !isUploading && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={currentImage}
            alt="Featured image preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!currentImage && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
            ${isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }
            ${isUploading ? 'pointer-events-none' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-sm text-gray-600 mb-2">Uploading image...</p>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-700 mb-2">
                  {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 text-center">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
              </>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* File Format Help */}
      {!currentImage && !isUploading && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Image className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-700 font-medium">Image Guidelines</p>
            <p className="text-xs text-blue-600">
              For best results, use high-quality images with a 16:9 aspect ratio (1200x675px recommended)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}