import type { BusinessStatus, MediaType, UserRole } from "../types";

export interface ApiCategory {
  categoryId: string;
  parentId: string | null;
  name: string;
  slug: string;
  iconURL: string | null;
  children?: ApiCategory[];
}

export interface ApiOperatingHour {
  scheduleId?: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface ApiLocation {
  locationId: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
  operatingHours: ApiOperatingHour[];
}

export interface ApiMediaAsset {
  mediaId: string;
  entityType: MediaType;
  fileURL: string;
  uploadDate?: string;
}

export interface ApiBusiness {
  businessId: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  taxId: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  websiteURL: string | null;
  socialLinks: Record<string, string> | null;
  status: BusinessStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  categories: ApiCategory[];
  locations: ApiLocation[];
  media: ApiMediaAsset[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiAuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: ApiAuthUser;
}

export interface ApiRole {
  roleId: string;
  name: UserRole;
}

export interface ApiUser {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  role: ApiRole | null;
}

export interface OperatingHourInput {
  dayOfWeek: number;
  openTime?: string | null;
  closeTime?: string | null;
  isClosed?: boolean;
}

export interface CreateBusinessInput {
  name: string;
  description?: string;
  taxId?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteURL?: string;
  socialLinks?: Record<string, string>;
  categoryIds: string[];
  location?: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    isPrimary?: boolean;
    operatingHours?: OperatingHourInput[];
  };
}

export interface UpdateBusinessInput {
  name?: string;
  description?: string | null;
  taxId?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  websiteURL?: string | null;
  socialLinks?: Record<string, string> | null;
  categoryIds?: string[];
}
