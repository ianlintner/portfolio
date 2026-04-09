/**
 * Utility functions for generating SEO and social media metadata
 */

/**
 * Normalize a site URL or host into an absolute URL
 */
function normalizeSiteUrl(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

/**
 * Get the site base URL from environment or default to localhost
 */
export function getSiteUrl(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  return siteUrl ? normalizeSiteUrl(siteUrl) : "http://localhost:3000";
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
  return getAbsoluteUrl("/images/social-default.png");
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
