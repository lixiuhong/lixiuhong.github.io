import { getBooks } from "@/lib/sanity.queries";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books I Read - Xiuhong Li",
};

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
        Books I Read
      </h1>

      {books.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500">
          No book reviews yet. Add markdown files to data/books/.
        </p>
      )}

      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        {books.map((book) => (
          <div key={book.slug} className="py-3">
            <Link
              href={`/books/${book.slug}`}
              className="font-medium hover:underline"
            >
              {book.title}
            </Link>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
              by {book.author} • {new Date(book.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {book.rating && (
                <span className="ml-2">
                  {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
                </span>
              )}
            </p>
            {book.summary && (
              <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                {book.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}