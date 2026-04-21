import { getBlogBySlug, getBlogs } from "@/lib/sanity.queries";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import KatexCopyMenu from "@/components/KatexCopyMenu";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getBlogBySlug(params.slug);
  if (!result) return { title: "Not Found" };
  return { title: `${result.meta.title} - Xiuhong Li` };
}

function rewriteImagePaths(content: string, slug: string): string {
  // Rewrite markdown images: ![alt](relative-path)
  let result = content.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
    (_, alt, src) => `![${alt}](/data/blogs/${slug}/${src})`
  );
  // Rewrite HTML img tags: <img src="relative-path">
  result = result.replace(
    /(<img\s[^>]*src=["'])(?!https?:\/\/)([^"']+)(["'])/g,
    (_, before, src, after) => `${before}/data/blogs/${slug}/${src}${after}`
  );
  return result;
}

export default async function BlogPostPage({ params }: Props) {
  const result = await getBlogBySlug(params.slug);
  if (!result) notFound();

  const content = rewriteImagePaths(result.content, params.slug);

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">{result.meta.title}</h1>
      <p className="text-sm text-gray-500 dark:text-slate-500 mb-8">
        {new Date(result.meta.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <KatexCopyMenu>
        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                format: "md",
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypeRaw, rehypeHighlight, rehypeKatex],
              },
            }}
          />
        </article>
      </KatexCopyMenu>
    </div>
  );
}
