/**
 * Utility to resolve product and artisan images across development and production environments.
 * Handles external CDN URLs (Unsplash), static uploads from Express backend, and fallback placeholders.
 */

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80';

export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return FALLBACK_IMAGE;
  }

  const trimmed = url.trim();

  // Return full HTTP/HTTPS or data URLs untouched
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Prepend backend host if configured for static uploads
  const backendBase = import.meta.env.VITE_API_URL || '';
  if (backendBase) {
    const cleanBackend = backendBase.replace(/\/+$/, '');
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${cleanBackend}${cleanPath}`;
  }

  return trimmed;
};

export default getImageUrl;
