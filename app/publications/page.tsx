import { getPublications } from "@/lib/sanity.queries";
import PublicationEntry from "@/components/PublicationEntry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications - Xiuhong Li",
};

export default async function PublicationsPage() {
  const publications = await getPublications();

  const groupedByYear = publications.reduce<Record<number, typeof publications>>(
    (acc, pub) => {
      const year = pub.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    },
    {}
  );

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
        Publications
      </h1>

      {sortedYears.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500">
          No publications yet. Add them to data/publications.json.
        </p>
      )}

      {sortedYears.map((year) => (
        <section key={year} className="mb-8">
          <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200 dark:border-slate-700">
            {year}
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {groupedByYear[year].map((pub) => (
              <PublicationEntry key={pub.id} pub={pub} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
