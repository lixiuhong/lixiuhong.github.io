import { getBlogs } from "@/lib/sanity.queries";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs - Xiuhong Li",
};

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
        Blogs
      </h1>

      {blogs.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500">
          No blog posts yet. Add markdown files to data/blogs/.
        </p>
      )}

      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        {blogs.map((blog) => (
          <div key={blog.slug} className="py-3">
            <Link
              href={`/blogs/${blog.slug}`}
              className="font-medium hover:underline"
            >
              {blog.title}
            </Link>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {blog.summary && (
              <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                {blog.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
