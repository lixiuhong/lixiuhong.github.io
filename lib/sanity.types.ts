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
  text: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  bio: string;
  photoUrl?: string;
  socialLinks: SocialLink[];
  researchInterests: ResearchInterest[];
  awards: Award[];
  news: NewsItem[];
  cvUrl?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: "conference" | "journal" | "preprint";
  abstract?: string;
  award?: string;
  pdfUrl?: string;
  externalUrl?: string;
  codeUrl?: string;
  slidesUrl?: string;
  scholarUrl?: string;
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  location?: string;
  type?: "invited" | "conference" | "workshop";
  description?: string;
  slidesUrl?: string;
  videoUrl?: string;
  eventUrl?: string;
  url?: string;
}
