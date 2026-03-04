import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export interface Post extends PostMeta {
  content: string;
}

function parseDate(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "";
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR);
  const posts: PostMeta[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(raw);
    const date = parseDate(data.date) || "";
    posts.push({
      slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      date,
    });
  }

  return posts.sort((a, b) => (b.date.localeCompare(a.date)));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const date = parseDate(data.date) || "";

  return {
    slug,
    title: (data.title as string) || slug,
    description: (data.description as string) || "",
    date,
    content: content.trim(),
  };
}
