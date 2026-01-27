export function stripHtml(html: string): string {
  // First remove pre and code tags but keep content
  const withoutPreCode = html.replace(/<\/?(?:pre|code)[^>]*>/g, '')
  
  // Then decode HTML entities
  const decoded = withoutPreCode.replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    
  // Remove any remaining HTML tags
  return decoded.replace(/<[^>]*>/g, '').trim()
} 