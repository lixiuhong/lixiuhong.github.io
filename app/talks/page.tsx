import { getTalks } from "@/lib/sanity.queries";
import TalkEntry from "@/components/TalkEntry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talks - Xiuhong Li",
};

export default async function TalksPage() {
  const talks = await getTalks();

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
        Talks
      </h1>

      {talks.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500">
          No talks yet. Add them to data/talks.json.
        </p>
      )}

      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        {talks.map((talk) => (
          <TalkEntry key={talk.id} talk={talk} />
        ))}
      </div>
    </div>
  );
}
