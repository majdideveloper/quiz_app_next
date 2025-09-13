// Color contrast utilities for WCAG compliance
export const colorContrast = {
  // Check if color combination meets WCAG AA standards (4.5:1 ratio)
  meetsWCAGAA: (foreground: string, background: string): boolean => {
    const ratio = calculateContrastRatio(foreground, background)
    return ratio >= 4.5
  },
  
  // Check if color combination meets WCAG AAA standards (7:1 ratio)
  meetsWCAGAAA: (foreground: string, background: string): boolean => {
    const ratio = calculateContrastRatio(foreground, background)
    return ratio >= 7
  }
}

// Calculate relative luminance of a color
function getLuminance(color: string): number {
  // Convert hex to RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Convert to relative luminance
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio between two colors
function calculateContrastRatio(foreground: string, background: string): number {
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

// Focus management utilities
export const focusManagement = {
  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')
    
    return Array.from(container.querySelectorAll(selector))
  },
  
  // Trap focus within a container
  trapFocus: (container: HTMLElement, event: KeyboardEvent) => {
    const focusableElements = focusManagement.getFocusableElements(container)
    if (focusableElements.length === 0) return
    
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]
    
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable.focus()
        }
      }
    }
  }
}

// Screen reader utilities
export const screenReader = {
  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle escape key to close modals/dropdowns
  handleEscape: (callback: () => void) => (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      callback()
    }
  },
  
  // Handle enter/space for custom interactive elements
  handleActivation: (callback: () => void) => (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }
}

// Canadian accessibility compliance helpers
export const canadianCompliance = {
  // Generate proper French language attributes
  getFrenchLangAttribute: () => 'fr-CA',
  getEnglishLangAttribute: () => 'en-CA',
  
  // AODA (Accessibility for Ontarians with Disabilities Act) helpers
  aoda: {
    // Minimum requirements for interactive elements
    minimumTouchTarget: 44, // pixels (WCAG 2.1 AA)
    minimumClickTarget: 44, // pixels
    
    // Required ARIA labels for common elements
    getRequiredLabels: () => ({
      searchButton: 'Search',
      menuButton: 'Menu',
      closeButton: 'Close',
      submitButton: 'Submit',
      cancelButton: 'Cancel'
    })
  },
  
  // Bilingual content helpers
  bilingual: {
    // Ensure both languages are properly marked
    markupBilingualContent: (englishText: string, frenchText: string) => ({
      en: { text: englishText, lang: 'en-CA' },
      fr: { text: frenchText, lang: 'fr-CA' }
    }),
    
    // Generate alternates for language switching
    generateLanguageAlternates: (currentLang: string) => ({
      'en-CA': currentLang !== 'en',
      'fr-CA': currentLang !== 'fr'
    })
  }
}

// Form accessibility helpers
export const formAccessibility = {
  // Generate proper error messages
  generateErrorMessage: (fieldName: string, errorType: string, language: 'en' | 'fr' = 'en') => {
    const errors = {
      en: {
        required: `${fieldName} is required`,
        invalid: `${fieldName} is invalid`,
        tooShort: `${fieldName} is too short`,
        tooLong: `${fieldName} is too long`
      },
      fr: {
        required: `${fieldName} est requis`,
        invalid: `${fieldName} est invalide`,
        tooShort: `${fieldName} est trop court`,
        tooLong: `${fieldName} est trop long`
      }
    }
    
    return errors[language][errorType as keyof typeof errors.en] || `${fieldName} error`
  },
  
  // Generate proper field descriptions
  generateFieldDescription: (fieldName: string, requirements: string[], language: 'en' | 'fr' = 'en') => {
    const descriptions = {
      en: `${fieldName} requirements: ${requirements.join(', ')}`,
      fr: `Exigences pour ${fieldName}: ${requirements.join(', ')}`
    }
    
    return descriptions[language]
  }
}