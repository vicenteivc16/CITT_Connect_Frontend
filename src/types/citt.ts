export type CittRole =
  | 'personal_duoc'
  | 'lider_citt'
  | 'consejero_carrera'
  | 'usuario_citt'
  | 'partner'
  | 'dev';

export type DuocSchoolSlug =
  | 'informatica'
  | 'ingenieria'
  | 'diseno'
  | 'administracion'
  | 'comunicacion'
  | 'construccion'
  | 'salud'
  | 'gastronomia'
  | 'turismo';

export interface DuocSchool {
  slug: DuocSchoolSlug;
  name: string;
  shortName: string;
  cssClass: string;
  primaryHex: string;
  secondaryHex: string;
}

export interface CittCampus {
  slug: string;
  name: string;
  shortName: string;
  region: string;
}

export interface CittBannerPreset {
  id: string;
  label: string;
  category: string;
  imageUrl: string;
}

export interface CittMemberProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  careerTitle: string;
  currentOccupation: string;
  specialties: string[];
  bio: string;
  role: CittRole;
  campusSlug: string;
  schoolSlug: DuocSchoolSlug;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  instagramUrl?: string;
  otherSocialLabel?: string;
  otherSocialUrl?: string;
  phoneOptional?: string;
  partnerOrganization?: string;
  representedCareerInfo?: string;
  isOpenToCollaborate: boolean;
  isVerified: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
  academicTrack?: string;
  achievements?: string[];
}

export interface CittProject {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: 'idea' | 'en_desarrollo' | 'prototipo' | 'finalizado';
  leadUsername: string;
  leadName: string;
  leadRole: CittRole;
  originCampusSlug: string;
  schoolSlug: DuocSchoolSlug;
  lookingForCollaborators: boolean;
  neededSpecialties: string[];
  helpRequestDetails: string;
  repoUrl?: string;
  createdAt: string;
}

export interface CittFeedPost {
  id: string;
  authorUsername: string;
  authorName: string;
  authorRole: CittRole;
  authorOccupation: string;
  campusSlug: string;
  category:
    | 'noticia_citt'
    | 'evento_nacional'
    | 'oportunidad_partner'
    | 'puente_consejero'
    | 'pedir_ayuda';
  title: string;
  content: string;
  actionLabel?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface CittBlogArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  contentParagraphs: string[];
  coverImageUrl: string;
  authorName: string;
  authorRole: CittRole;
  authorAvatarUrl: string;
  campusSlug: string;
  schoolSlug: DuocSchoolSlug;
  readTime: string;
  publishedAt: string;
  featured?: boolean;
}

export interface CittPinterestPin {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  imageHeightClass: 'h-52' | 'h-64' | 'h-80' | 'h-96';
  tag: 'Robótica & IoT' | 'Ciberseguridad' | 'IA & Software' | 'Diseño & Fabricación 3D' | 'Comunidad Inter-Sedes';
  campusSlug: string;
  schoolSlug: DuocSchoolSlug;
  authorName: string;
}
