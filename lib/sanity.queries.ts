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

function findMdFile(dir: string): string | null {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.length > 0 ? path.join(dir, files[0]) : null;
}

export async function getBlogs(): Promise<Blog[]> {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  const entries = fs.readdirSync(BLOGS_DIR, { withFileTypes: true });
  const blogs: Blog[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const mdPath = findMdFile(path.join(BLOGS_DIR, slug));
    if (!mdPath) continue;
    const raw = fs.readFileSync(mdPath, "utf-8");
    const { data, content } = matter(raw);
    blogs.push({
      slug,
      title: data.title,
      date: data.date,
      summary:
        data.summary || content.replace(/[#*>\-\n]/g, " ").trim().slice(0, 150),
    });
  }
  return blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogBySlug(slug: string) {
  const blogDir = path.join(BLOGS_DIR, slug);
  if (!fs.existsSync(blogDir)) return null;
  const mdPath = findMdFile(blogDir);
  if (!mdPath) return null;
  const raw = fs.readFileSync(mdPath, "utf-8");
  const { data, content } = matter(raw);
  const meta: Blog = {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
  };
  return { meta, content };
}
