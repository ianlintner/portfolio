/**
 * Tests for metadata utility functions
 */

import {
  getSiteUrl,
  getAbsoluteUrl,
  getDefaultSocialImage,
  getBlogPostImage,
} from "../metadata";

describe("Metadata Utils", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const originalNextAuthUrl = process.env.NEXTAUTH_URL;
  const originalVercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const originalVercelUrl = process.env.VERCEL_URL;

  afterEach(() => {
    // Restore original environment
    if (originalEnv) {
      process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }

    if (originalNextAuthUrl) {
      process.env.NEXTAUTH_URL = originalNextAuthUrl;
    } else {
      delete process.env.NEXTAUTH_URL;
    }

    if (originalVercelProductionUrl) {
      process.env.VERCEL_PROJECT_PRODUCTION_URL = originalVercelProductionUrl;
    } else {
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    }

    if (originalVercelUrl) {
      process.env.VERCEL_URL = originalVercelUrl;
    } else {
      delete process.env.VERCEL_URL;
    }
  });

  describe("getSiteUrl", () => {
    it("should return the site URL from environment variable", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
      expect(getSiteUrl()).toBe("https://example.com");
    });

    it("should fall back to NEXTAUTH_URL when public site URL is not set", () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      process.env.NEXTAUTH_URL = "https://auth.example.com";

      expect(getSiteUrl()).toBe("https://auth.example.com");
    });

    it("should normalize Vercel hostnames into https URLs", () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      delete process.env.NEXTAUTH_URL;
      process.env.VERCEL_PROJECT_PRODUCTION_URL = "portfolio.example.com";

      expect(getSiteUrl()).toBe("https://portfolio.example.com");
    });

    it("should return localhost default when environment variable is not set", () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      delete process.env.NEXTAUTH_URL;
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
      delete process.env.VERCEL_URL;
      expect(getSiteUrl()).toBe("http://localhost:3000");
    });
  });

  describe("getAbsoluteUrl", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    });

    it("should build absolute URL from relative path with leading slash", () => {
      expect(getAbsoluteUrl("/blog")).toBe("https://example.com/blog");
    });

    it("should build absolute URL from relative path without leading slash", () => {
      expect(getAbsoluteUrl("blog")).toBe("https://example.com/blog");
    });

    it("should handle trailing slash in site URL", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
      expect(getAbsoluteUrl("/blog")).toBe("https://example.com/blog");
    });

    it("should handle nested paths", () => {
      expect(getAbsoluteUrl("/blog/post-slug")).toBe(
        "https://example.com/blog/post-slug",
      );
    });
  });

  describe("getDefaultSocialImage", () => {
    it("should return absolute URL for default social image", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
      expect(getDefaultSocialImage()).toBe(
        "https://example.com/images/social-default.svg",
      );
    });
  });

  describe("getBlogPostImage", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    });

    it("should return absolute URL for relative image path", () => {
      expect(getBlogPostImage("/images/custom.png")).toBe(
        "https://example.com/images/custom.png",
      );
    });

    it("should return absolute URL if already provided", () => {
      expect(getBlogPostImage("https://cdn.example.com/image.png")).toBe(
        "https://cdn.example.com/image.png",
      );
    });

    it("should return http absolute URL if already provided", () => {
      expect(getBlogPostImage("http://cdn.example.com/image.png")).toBe(
        "http://cdn.example.com/image.png",
      );
    });

    it("should return default image when no custom image provided", () => {
      expect(getBlogPostImage()).toBe(
        "https://example.com/images/social-default.svg",
      );
    });

    it("should return default image when undefined is provided", () => {
      expect(getBlogPostImage(undefined)).toBe(
        "https://example.com/images/social-default.svg",
      );
    });
  });
});
