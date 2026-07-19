import DOMPurify from 'dompurify';

/**
 * Decodes HTML entities in plain text strings (e.g., &amp; to &, &quot; to ")
 * Useful for decoding entities in titles and other plain text fields
 * @param text - Text string containing HTML entities
 * @returns Decoded text string
 */
export const decodeHTMLEntities = (text: string): string => {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value || textarea.textContent || text;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML string from JSON response
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'p', 'strong', 'em', 'u', 'br', 'span', 'div', 'ul', 'ol', 'li', 'hr', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

/**
 * Strips HTML tags to get plain text for word counting
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
const stripHTMLTags = (html: string): string => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Truncates HTML content to a specified number of words while preserving HTML structure
 * Uses a simpler approach: truncates at word boundaries in plain text, then reconstructs HTML
 * @param html - HTML string to truncate
 * @param wordCount - Number of words to keep
 * @returns Truncated HTML string
 */
export const truncateHTMLToWords = (html: string, wordCount: number): string => {
  if (!html) return '';
  
  // Get plain text for word counting
  const plainText = stripHTMLTags(html);
  const words = plainText.trim().split(/\s+/);
  
  // If text is shorter than word count, return original
  if (words.length <= wordCount) return html;
  
  // Create a temporary element to work with HTML
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  
  // Find where to truncate in plain text
  const targetWords = words.slice(0, wordCount);
  const targetTextLength = targetWords.join(' ').length;
  
  // Walk through the DOM and truncate at the right point
  const walker = document.createTreeWalker(
    tmp,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let currentTextLength = 0;
  let textNode: Node | null;
  
  while ((textNode = walker.nextNode())) {
    const nodeText = textNode.textContent || '';
    const nodeLength = nodeText.length;
    
    if (currentTextLength + nodeLength >= targetTextLength) {
      // Truncate at this node
      const truncateAt = targetTextLength - currentTextLength;
      // Find the last complete word before truncateAt
      const textBeforeTruncate = nodeText.substring(0, truncateAt);
      const lastSpaceIndex = textBeforeTruncate.lastIndexOf(' ');
      const finalTruncatePoint = lastSpaceIndex > 0 ? lastSpaceIndex : truncateAt;
      
      textNode.textContent = nodeText.substring(0, finalTruncatePoint);
      
      // Remove all subsequent text nodes and empty elements
      let nextNode = walker.nextNode();
      while (nextNode) {
        nextNode.textContent = '';
        nextNode = walker.nextNode();
      }
      
      // Remove empty parent elements
      let parent = textNode.parentElement;
      while (parent && parent !== tmp) {
        const siblings = Array.from(parent.childNodes);
        const hasContent = siblings.some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        );
        if (!hasContent) {
          const nextParent = parent.parentElement;
          parent.remove();
          parent = nextParent || null;
        } else {
          break;
        }
      }
      
      break;
    }
    
    currentTextLength += nodeLength;
  }
  
  return tmp.innerHTML.trim();
};

/**
 * Checks if HTML content exceeds a certain word count
 * @param html - HTML string to check
 * @param wordCount - Number of words to check against
 * @returns true if content has more words than wordCount
 */
export const exceedsWordCount = (html: string, wordCount: number): boolean => {
  if (!html) return false;
  const plainText = stripHTMLTags(html);
  const words = plainText.trim().split(/\s+/);
  return words.length > wordCount;
};

/**
 * Removes href, target, and rel attributes from anchor tags while preserving link text
 * Useful for preview lists where links should not be clickable
 * @param html - HTML string containing anchor tags
 * @returns HTML string with href attributes removed from anchor tags
 */
export const removeHrefAttributes = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary element to work with HTML
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  
  // Find all anchor tags and remove href, target, and rel attributes
  const anchorTags = tmp.querySelectorAll('a');
  anchorTags.forEach((anchor) => {
    anchor.removeAttribute('href');
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
  });
  
  return tmp.innerHTML;
};

/**
 * Word count limit for preview descriptions
 */
export const PREVIEW_WORD_LIMIT = 40;

/**
 * Processes preview description HTML through the full pipeline:
 * - Removes href attributes
 * - Sanitizes HTML
 * - Checks if truncation is needed (single check)
 * - Truncates if necessary
 * @param description - Raw HTML description string
 * @param wordLimit - Maximum number of words to allow
 * @returns Object containing processed HTML and truncation status
 */
export const processPreviewDescription = (
  description: string,
  wordLimit: number
): { processedHTML: string; isTruncated: boolean } => {
  const descriptionText = description || '';
  // Remove href attributes first (prevents navigation conflicts)
  const withoutHrefs = removeHrefAttributes(descriptionText);
  // Then sanitize for security
  const sanitized = sanitizeHTML(withoutHrefs);
  // Check if truncation is needed (single check)
  const needsTruncation = exceedsWordCount(sanitized, wordLimit);
  // Truncate if needed
  const processedHTML = needsTruncation
    ? truncateHTMLToWords(sanitized, wordLimit) + '...'
    : sanitized;
  
  return {
    processedHTML,
    isTruncated: needsTruncation
  };
};

