export interface SiteData {
  name: string;
  description: string;
  descriptionEn: string;
  url: string;
  language: string;
  tagline: string;
  establishedYear: number;
  socials: { platform: string; url: string }[];
  contactEmail: string;
}

export interface NavLink {
  label: string;
  href: string;
  id: string;
}

export interface Member {
  id: string;
  name: string;
  nickname: string;
  description: string;
  interests: string[];
  avatarSrc: string;
  socials: { platform: string; url: string }[];
}

export interface Moment {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  imageSrc: string;
  alt: string;
}
