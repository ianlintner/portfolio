# Social Media Meta Tags Documentation

## Overview

This portfolio site includes comprehensive social media meta tags for blog posts, enabling rich preview cards on LinkedIn, Twitter/X, Facebook, and other social platforms.

## Features

- **Open Graph** tags for LinkedIn, Facebook, and other platforms
- **Twitter Card** support with large images
- **Canonical URLs** for SEO
- **Article metadata** including author, publish date, and tags
- **Custom or default images** per blog post
- **Automatic absolute URL generation**

## Configuration

### Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

For local development, this defaults to `http://localhost:3000`.

## Adding Social Images to Blog Posts

### Option 1: Use Default Image

No configuration needed! Posts without a custom image automatically use `/images/social-default.svg`.

### Option 2: Add Custom Image

Update the frontmatter in your MDX blog post:

```yaml
---
title: "Your Blog Post Title"
date: 2025-01-15
excerpt: "A brief description of your post"
tags: ["web development", "react"]
author: "Ian Lintner"
image: "/images/your-custom-image.png"
imageAlt: "Descriptive alt text for your image"
---
```

**Image Specifications:**
- **Size**: 1200x630 pixels (recommended for best display)
- **Format**: PNG, JPG, SVG, or WebP
- **Location**: Place in `/public/images/` directory
- **Path**: Use relative path starting with `/images/`

### Option 3: Use External Image URL

You can also use images hosted elsewhere:

```yaml
image: "https://cdn.example.com/my-blog-image.png"
imageAlt: "Description of the external image"
```

## Generated Meta Tags

For each blog post, the following meta tags are automatically generated:

### Open Graph Tags
- `og:title` - Post title
- `og:description` - Post excerpt
- `og:type` - "article"
- `og:url` - Canonical URL
- `og:site_name` - "Ian Lintner - Full Stack Developer"
- `og:locale` - "en_US"
- `og:image` - Social preview image (1200x630)
- `og:image:width` - 1200
- `og:image:height` - 630
- `og:image:alt` - Image description
- `article:published_time` - ISO 8601 timestamp
- `article:author` - Post author
- `article:tag` - Post tags

### Twitter Card Tags
- `twitter:card` - "summary_large_image"
- `twitter:title` - Post title
- `twitter:description` - Post excerpt
- `twitter:creator` - "@ianlintner"
- `twitter:image` - Social preview image

### SEO Tags
- `<title>` - Post title
- `<meta name="description">` - Post excerpt
- `<meta name="keywords">` - Post tags
- `<link rel="canonical">` - Canonical URL
- `<meta name="author">` - Post author

## Creating Social Images

### Using SVG (Recommended for Simple Graphics)

SVG images are lightweight and scale perfectly. See `/public/images/social-default.svg` for an example:

```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f172a"/>
  <text x="600" y="315" font-family="Arial" font-size="48" 
        fill="#ffffff" text-anchor="middle">Your Title</text>
</svg>
```

### Using Design Tools

Popular options for creating social images:
- **Figma** - Design at 1200x630px, export as PNG
- **Canva** - Use "LinkedIn Post" or "Twitter Post" template
- **Photoshop** - Create artboard at 1200x630px
- **GIMP** - Free alternative to Photoshop

### Automated Image Generation

For automated social image generation, consider:
- **@vercel/og** - Generate images at the edge
- **Cloudinary** - Dynamic social images via URL
- **Puppeteer** - Screenshot HTML templates

## Testing Meta Tags

### Validation Tools

Test your social media cards before publishing:

- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Open Graph Checker**: https://www.opengraph.xyz/

### Manual Testing

1. Deploy your changes to a public URL
2. Paste the blog post URL into each validator
3. Check that:
   - Image displays correctly
   - Title and description are accurate
   - No errors or warnings appear

## Troubleshooting

### Image Not Showing

- Verify image exists in `/public/images/`
- Check image path in frontmatter (must start with `/`)
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
- Clear social media cache (use validation tools)

### Wrong Image Displaying

- Social platforms cache images for ~7 days
- Use validation tools to force cache refresh
- Check that frontmatter `image` field is correct

### Image Too Small/Large

- Recommended: 1200x630px (1.91:1 aspect ratio)
- Minimum: 600x315px
- Images are automatically sized in meta tags

## Best Practices

1. **Use High-Quality Images**: Social previews are the first impression
2. **Keep Text Readable**: Use large fonts (40px+) for legibility
3. **Test Across Platforms**: Each platform may render slightly differently
4. **Add Alt Text**: Always include `imageAlt` for accessibility
5. **Optimize File Size**: Compress images to < 500KB for fast loading
6. **Consistent Branding**: Use similar styles across all posts

## Example Blog Post

```yaml
---
title: "Building Modern Web Apps with Next.js 15"
date: 2025-01-15
excerpt: "Learn how to build fast, scalable web applications using Next.js 15, React 19, and TypeScript."
tags: ["Next.js", "React", "TypeScript", "Web Development"]
author: "Ian Lintner"
image: "/images/nextjs-15-guide.png"
imageAlt: "Next.js 15 logo with React and TypeScript icons"
---

# Building Modern Web Apps with Next.js 15

Your content here...
```

## Support

For questions or issues with social media tags, please open an issue in the repository.
