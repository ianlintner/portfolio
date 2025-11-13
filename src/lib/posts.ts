import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/app/blog");

export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  id?: string;
  tags?: string[];
  author?: string;
  image?: string;
  imageAlt?: string;
}

export function getAllPosts(): PostMeta[] {
  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      slug,
      id: slug,
      tags: data.tags || [],
      author: data.author || "Ian Lintner",
      image: data.image,
      imageAlt: data.imageAlt,
    } as PostMeta;
  });

  // Sort by date descending (newest first) - properly handle date comparison
  return posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    meta: {
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      slug,
      id: slug,
      tags: data.tags || [],
      author: data.author || "Ian Lintner",
      image: data.image,
      imageAlt: data.imageAlt,
    },
    content,
  };
}
