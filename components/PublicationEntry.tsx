import type { Publication } from "@/lib/sanity.types";

function highlightAuthor(authors: string, name: string) {
  const parts = authors.split(new RegExp(`(${name})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === name.toLowerCase() ? (
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function PublicationEntry({ pub }: { pub: Publication }) {
  return (
    <div className="py-3">
      <p className="font-medium">{pub.title}</p>
      <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
        {highlightAuthor(pub.authors, "Xiuhong Li")}. <span className="italic">{pub.venue} {pub.year}</span>
      </p>
      <div className="flex gap-2 mt-1 text-sm items-center">
        {pub.award && (
          <span className="text-red-600 dark:text-red-400 font-semibold text-xs">{pub.award}</span>
        )}
        {pub.pdfUrl && (
          <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">
            [PDF]
          </a>
        )}
        {pub.externalUrl && (
          <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer">
            [link]
          </a>
        )}
        {pub.codeUrl && (
          <a href={pub.codeUrl} target="_blank" rel="noopener noreferrer">
            [code]
          </a>
        )}
        {pub.slidesUrl && (
          <a href={pub.slidesUrl} target="_blank" rel="noopener noreferrer">
            [slides]
          </a>
        )}
        {pub.scholarUrl && (
          <a href={pub.scholarUrl} target="_blank" rel="noopener noreferrer">
            [Google Scholar]
          </a>
        )}
      </div>
    </div>
  );
}
