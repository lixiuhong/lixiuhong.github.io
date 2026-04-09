import type { PortableTextBlock } from "@portabletext/types";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ResearchInterest {
  title: string;
  description: string;
}

export interface Award {
  date: string;
  description: string;
}

export interface NewsItem {
  date: string;
  text: PortableTextBlock[];
}

export interface Profile {
  _id: string;
  name: string;
  title: string;
  location: string;
  bio: PortableTextBlock[];
  photo?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  socialLinks: SocialLink[];
  researchInterests: ResearchInterest[];
  awards: Award[];
  news: NewsItem[];
  cvFile?: {
    asset: {
      url: string;
    };
  };
}

export interface Publication {
  _id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  date: string;
  type: "conference" | "journal" | "preprint";
  abstract?: string;
  pdfUrl?: string;
  externalUrl?: string;
  codeUrl?: string;
  slidesUrl?: string;
  scholarUrl?: string;
}

export interface Talk {
  _id: string;
  title: string;
  event: string;
  date: string;
  location?: string;
  type?: "invited" | "conference" | "workshop";
  description?: string;
  slidesUrl?: string;
  videoUrl?: string;
  eventUrl?: string;
}
