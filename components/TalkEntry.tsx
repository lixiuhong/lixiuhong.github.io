import type { Talk } from "@/lib/sanity.types";

const TYPE_LABELS: Record<string, string> = {
  invited: "Invited",
  conference: "Conference",
  workshop: "Workshop",
};

export default function TalkEntry({ talk }: { talk: Talk }) {
  const formattedDate = talk.date
    ? new Date(talk.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="py-3">
      <div className="flex items-start gap-2">
        <p className="font-medium">{talk.title}</p>
        {talk.type && (
          <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
            {TYPE_LABELS[talk.type] || talk.type}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
        {talk.event}
        {talk.location && ` · ${talk.location}`}
        {formattedDate && ` · ${formattedDate}`}
      </p>
      {talk.description && (
        <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
          {talk.description}
        </p>
      )}
      <div className="flex gap-2 mt-1 text-sm">
        {talk.slidesUrl && (
          <a href={talk.slidesUrl} target="_blank" rel="noopener noreferrer">
            [slides]
          </a>
        )}
        {talk.videoUrl && (
          <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
            [video]
          </a>
        )}
        {talk.eventUrl && (
          <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer">
            [event]
          </a>
        )}
      </div>
    </div>
  );
}
