import type { Publication } from "@/lib/sanity.types";

export default function PublicationEntry({ pub }: { pub: Publication }) {
  return (
    <div className="py-3">
      <p className="font-medium">{pub.title}</p>
      <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
        {pub.authors}. <span className="italic">{pub.venue} {pub.year}</span>
      </p>
      <div className="flex gap-2 mt-1 text-sm">
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
