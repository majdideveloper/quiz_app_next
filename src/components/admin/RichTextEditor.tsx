'use client'

import { useState, useRef, useCallback } from 'react'
import { Bold, Italic, Quote } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content here...", 
  rows = 15,
  required = false 
}: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertFormatting = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let newText
    if (selectedText) {
      // If text is selected, wrap it with formatting
      newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    } else {
      // If no text selected, insert formatting markers
      newText = value.substring(0, start) + before + after + value.substring(end)
    }

    onChange(newText)

    // Set cursor position after the formatting
    setTimeout(() => {
      if (selectedText) {
        textarea.selectionStart = start + before.length
        textarea.selectionEnd = start + before.length + selectedText.length
      } else {
        const newCursorPos = start + before.length
        textarea.selectionStart = newCursorPos
        textarea.selectionEnd = newCursorPos
      }
      textarea.focus()
    }, 0)
  }, [value, onChange])

  const formatBold = () => insertFormatting('**', '**')
  const formatItalic = () => insertFormatting('*', '*')
  const formatQuote = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    // Find the start of the current line
    const beforeCursor = value.substring(0, start)
    const lineStart = beforeCursor.lastIndexOf('\n') + 1
    const currentLine = value.substring(lineStart, end)
    
    // Check if line already starts with quote
    if (currentLine.startsWith('> ')) {
      // Remove quote formatting
      const newText = value.substring(0, lineStart) + currentLine.substring(2) + value.substring(end)
      onChange(newText)
      setTimeout(() => {
        textarea.selectionStart = start - 2
        textarea.selectionEnd = end - 2
        textarea.focus()
      }, 0)
    } else {
      // Add quote formatting
      const newText = value.substring(0, lineStart) + '> ' + currentLine + value.substring(end)
      onChange(newText)
      setTimeout(() => {
        textarea.selectionStart = start + 2
        textarea.selectionEnd = end + 2
        textarea.focus()
      }, 0)
    }
  }

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering for preview
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.*)$/gm, '<blockquote style="border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; color: #6b7280; font-style: italic;">$1</blockquote>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
          Course Content *
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {!isPreviewMode && (
        <>
          {/* Formatting Toolbar */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            padding: '0.5rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderBottom: 'none',
            borderTopLeftRadius: '0.375rem',
            borderTopRightRadius: '0.375rem'
          }}>
            <button
              type="button"
              onClick={formatBold}
              title="Bold (Ctrl+B)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.25rem',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9'
                e.currentTarget.style.borderColor = '#cbd5e1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              <Bold size={14} />
            </button>

            <button
              type="button"
              onClick={formatItalic}
              title="Italic (Ctrl+I)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.25rem',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9'
                e.currentTarget.style.borderColor = '#cbd5e1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              <Italic size={14} />
            </button>

            <button
              type="button"
              onClick={formatQuote}
              title="Quote/Blockquote"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.25rem',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9'
                e.currentTarget.style.borderColor = '#cbd5e1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              <Quote size={14} />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderTop: 'none',
              borderBottomLeftRadius: '0.375rem',
              borderBottomRightRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
            }}
            onKeyDown={(e) => {
              if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                  case 'b':
                    e.preventDefault()
                    formatBold()
                    break
                  case 'i':
                    e.preventDefault()
                    formatItalic()
                    break
                }
              }
            }}
          />
        </>
      )}

      {isPreviewMode && (
        <div style={{
          width: '100%',
          minHeight: `${rows * 1.5}rem`,
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          backgroundColor: 'white',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          boxSizing: 'border-box'
        }}>
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: renderPreview(value) }} />
          ) : (
            <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
              {placeholder}
            </span>
          )}
        </div>
      )}

      {/* Formatting Help */}
      <div style={{ 
        fontSize: '0.75rem', 
        color: '#6b7280', 
        marginTop: '0.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span><strong>**bold**</strong></span>
        <span><em>*italic*</em></span>
        <span>&gt; quote</span>
        <span>Ctrl+B/I for shortcuts</span>
      </div>
    </div>
  )
}