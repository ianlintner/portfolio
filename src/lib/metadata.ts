/**
 * Utility functions for generating SEO and social media metadata
 */

/**
 * Get the site base URL from environment or default to localhost
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Build an absolute URL from a relative path
 */
export function getAbsoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();
  // Remove trailing slash from site URL and leading slash from path if both exist
  const cleanSiteUrl = siteUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanSiteUrl}${cleanPath}`;
}

/**
 * Get the default social image URL for the site
 */
export function getDefaultSocialImage(): string {
  return getAbsoluteUrl("/images/social-default.svg");
}

/**
 * Get a social image URL for a blog post
 * Falls back to default if no custom image is specified
 */
export function getBlogPostImage(customImage?: string): string {
  if (customImage && customImage.trim()) {
    // If it's already an absolute URL, return as is
    if (
      customImage.startsWith("http://") ||
      customImage.startsWith("https://")
    ) {
      return customImage;
    }
    // Otherwise, make it absolute
    return getAbsoluteUrl(customImage);
  }
  return getDefaultSocialImage();
}
