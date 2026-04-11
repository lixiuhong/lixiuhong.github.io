import type { Profile, Publication, Talk, Blog } from "./sanity.types";
import profileData from "@/data/profile.json";
import publicationsData from "@/data/publications.json";
import talksData from "@/data/talks.json";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function getProfile(): Promise<Profile | null> {
  return profileData as Profile;
}

export async function getPublications(): Promise<Publication[]> {
  return publicationsData as Publication[];
}

export async function getTalks(): Promise<Talk[]> {
  return talksData as Talk[];
}

const BLOGS_DIR = path.join(process.cwd(), "data", "blogs");

export async function getBlogs(): Promise<Blog[]> {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  const files = fs.readdirSync(BLOGS_DIR).filter((f) => f.endsWith(".md"));
  const blogs: Blog[] = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOGS_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title,
      date: data.date,
      summary:
        data.summary || content.replace(/[#*>\-\n]/g, " ").trim().slice(0, 150),
    };
  });
  return blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogBySlug(slug: string) {
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const meta: Blog = {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
  };
  return { meta, content };
}
