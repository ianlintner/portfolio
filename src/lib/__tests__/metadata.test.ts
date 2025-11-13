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

  afterEach(() => {
    // Restore original environment
    if (originalEnv) {
      process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });

  describe("getSiteUrl", () => {
    it("should return the site URL from environment variable", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
      expect(getSiteUrl()).toBe("https://example.com");
    });

    it("should return localhost default when environment variable is not set", () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
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
        "https://example.com/blog/post-slug"
      );
    });
  });

  describe("getDefaultSocialImage", () => {
    it("should return absolute URL for default social image", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
      expect(getDefaultSocialImage()).toBe(
        "https://example.com/images/social-default.png"
      );
    });
  });

  describe("getBlogPostImage", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    });

    it("should return absolute URL for relative image path", () => {
      expect(getBlogPostImage("/images/custom.png")).toBe(
        "https://example.com/images/custom.png"
      );
    });

    it("should return absolute URL if already provided", () => {
      expect(getBlogPostImage("https://cdn.example.com/image.png")).toBe(
        "https://cdn.example.com/image.png"
      );
    });

    it("should return http absolute URL if already provided", () => {
      expect(getBlogPostImage("http://cdn.example.com/image.png")).toBe(
        "http://cdn.example.com/image.png"
      );
    });

    it("should return default image when no custom image provided", () => {
      expect(getBlogPostImage()).toBe(
        "https://example.com/images/social-default.png"
      );
    });

    it("should return default image when undefined is provided", () => {
      expect(getBlogPostImage(undefined)).toBe(
        "https://example.com/images/social-default.png"
      );
    });
  });
});
