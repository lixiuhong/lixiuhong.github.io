import { getTalks } from "@/lib/sanity.queries";
import TalkEntry from "@/components/TalkEntry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talks",
};

export default async function TalksPage() {
  const talks = await getTalks();

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Talks</h1>

      {talks.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500">
          No talks yet. Add them in Sanity Studio.
        </p>
      )}

      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        {talks.map((talk) => (
          <TalkEntry key={talk._id} talk={talk} />
        ))}
      </div>
    </div>
  );
}
