import { getProfile } from "@/lib/sanity.queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
};

export default async function CVPage() {
  const profile = await getProfile();
  const cvUrl = profile?.cvUrl;

  if (!cvUrl) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">CV</h1>
        <p className="text-gray-500 dark:text-slate-500">
          No CV available yet. Add a cvUrl to data/profile.json.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">CV</h1>

      <a
        href={cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-accent text-white px-5 py-2.5 rounded mb-6 no-underline hover:no-underline hover:bg-accent/90 transition-colors"
      >
        Download CV (PDF)
      </a>

      <div className="w-full border border-gray-200 dark:border-slate-700 rounded overflow-hidden">
        <iframe
          src={cvUrl}
          title="CV"
          className="w-full h-[80vh]"
        />
      </div>
    </div>
  );
}
