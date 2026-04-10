import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
