/**
 * Integration test for blog post metadata generation
 */

import { getPostBySlug } from "../posts";
import { getBlogPostImage, getAbsoluteUrl } from "../metadata";

describe("Blog Post Metadata Integration", () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  });

  it("should correctly parse blog post with custom image", () => {
    const { meta } = getPostBySlug("ai-coding-agent-tier-list-2025");

    expect(meta).toBeDefined();
    expect(meta.title).toBe("🧠 AI Coding Agent Tier List (2025 Edition)");
    expect(meta.image).toBe("/images/ai-coding-agents-social.svg");
    expect(meta.imageAlt).toBeTruthy();
  });

  it("should generate correct image URL for post with custom image", () => {
    const { meta } = getPostBySlug("ai-coding-agent-tier-list-2025");
    const imageUrl = getBlogPostImage(meta.image);

    expect(imageUrl).toBe(
      "https://example.com/images/ai-coding-agents-social.svg",
    );
  });

  it("should generate correct canonical URL", () => {
    const slug = "ai-coding-agent-tier-list-2025";
    const canonicalUrl = getAbsoluteUrl(`/blog/${slug}`);

    expect(canonicalUrl).toBe(
      "https://example.com/blog/ai-coding-agent-tier-list-2025",
    );
  });

  it("should include all required metadata fields", () => {
    const { meta } = getPostBySlug("ai-coding-agent-tier-list-2025");

    expect(meta.title).toBeTruthy();
    expect(meta.date).toBeTruthy();
    expect(meta.excerpt).toBeTruthy();
    expect(meta.author).toBeTruthy();
    expect(meta.tags).toBeInstanceOf(Array);
    expect(meta.tags!.length).toBeGreaterThan(0);
  });
});
