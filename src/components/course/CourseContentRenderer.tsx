'use client'

interface CourseContentRendererProps {
  content: string
}

export default function CourseContentRenderer({ content }: CourseContentRendererProps) {
  // Convert the markdown-like formatting to HTML
  const formatContent = (text: string): string => {
    if (!text) return ''

    let formatted = text
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic* to <em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert > quote to blockquote
      .replace(/^> (.*)$/gm, '<blockquote class="quote-block">$1</blockquote>')
      // Convert line breaks to <br>
      .replace(/\n/g, '<br>')

    return formatted
  }

  return (
    <div 
      className="course-content"
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      style={{
        lineHeight: '1.6',
        fontSize: '1rem',
        color: '#374151'
      }}
    />
  )
}