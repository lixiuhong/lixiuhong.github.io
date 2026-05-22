import { getBookBySlug, getBooks } from "@/lib/sanity.queries";
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
  const books = await getBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getBookBySlug(params.slug);
  if (!result) return { title: "Not Found" };
  return { title: `${result.meta.title} - Xiuhong Li` };
}

function rewriteImagePaths(content: string, slug: string): string {
  // Rewrite markdown images: ![alt](relative-path)
  let result = content.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
    (_, alt, src) => `![${alt}](/data/books/${slug}/${src})`
  );
  // Rewrite HTML img tags: <img src="relative-path">
  result = result.replace(
    /(<img\s[^>]*src=["'])(?!https?:\/\/)([^"']+)(["'])/g,
    (_, before, src, after) => `${before}/data/books/${slug}/${src}${after}`
  );
  return result;
}

export default async function BookPage({ params }: Props) {
  const result = await getBookBySlug(params.slug);
  if (!result) notFound();

  const content = rewriteImagePaths(result.content, params.slug);

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">{result.meta.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-500 mb-8">
        <span>by {result.meta.author}</span>
        <span>•</span>
        <span>
          {new Date(result.meta.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {result.meta.rating && (
          <>
            <span>•</span>
            <span className="text-yellow-500">
              {"★".repeat(result.meta.rating)}{"☆".repeat(5 - result.meta.rating)}
            </span>
          </>
        )}
      </div>
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