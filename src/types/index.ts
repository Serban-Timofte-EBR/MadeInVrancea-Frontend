/**
 * Shared domain types for the Made in Vrancea frontend.
 *
 * Note: the project's tsconfig enables `erasableSyntaxOnly`, so we model
 * closed sets as string-literal union types instead of TS enums.
 */

export type BusinessStatus = "Pending" | "Active" | "Suspended" | "Rejected";

export type UserRole = "Admin" | "BusinessOwner" | "Customer" | "Guest";

export type MediaType = "Logo" | "Cover" | "GalleryImage";

/** URL-friendly identifiers for the top-level categories. */
export type CategorySlug =
  | "crame"
  | "restaurante"
  | "cazare"
  | "ateliere-auto"
  | "beauty"
  | "cafenele"
  | "artizanat"
  | "produse-locale"
  | "brutarii"
  | "farmacii";

export interface Category {
  categoryId: string;
  parentId: string | null;
  name: string;
  slug: CategorySlug;
  /** Number of published businesses in this category (for the directory). */
  count: number;
}

export interface OperatingHour {
  /** 1 = Monday … 7 = Sunday. */
  dayOfWeek: number;
  /** 'HH:mm' — null when the day is marked closed. */
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface BusinessLocation {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
}

export interface Business {
  businessId: string;
  slug: string;
  name: string;
  primaryCategory: CategorySlug;
  categorySlugs: CategorySlug[];
  shortDescription: string;
  description: string;
  status: BusinessStatus;
  contactPhone: string;
  contactEmail: string;
  websiteUrl?: string;
  socialLinks: SocialLinks;
  location: BusinessLocation;
  operatingHours: OperatingHour[];
  coverImage: string;
  logoImage: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  /** ISO date the profile was submitted — used by the admin vetting queue. */
  submittedAt: string;
}
