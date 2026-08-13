import type {
  Business,
  BusinessLocation,
  CategorySlug,
  OperatingHour,
  SocialLinks,
} from "../types";
import type { ApiBusiness, ApiMediaAsset } from "./types";
import { API_ORIGIN } from "./http";

const FOCSANI = { latitude: 45.6966, longitude: 27.1863 };

const placeholderCover = (slug: string) =>
  `https://picsum.photos/seed/miv-${slug}-cover/1200/675`;
const placeholderLogo = (slug: string) =>
  `https://picsum.photos/seed/miv-${slug}-logo/240/240`;
const placeholderShot = (slug: string, n: number) =>
  `https://picsum.photos/seed/miv-${slug}-${n}/900/600`;

/** Keep absolute URLs as-is; prefix relative /uploads paths with the API origin when cross-origin. */
function resolveUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `${API_ORIGIN}${url}`;
}

function pickMedia(
  media: ApiMediaAsset[] | undefined,
  type: ApiMediaAsset["entityType"],
): string | undefined {
  const asset = (media ?? []).find((m) => m.entityType === type);
  return asset ? resolveUrl(asset.fileURL) : undefined;
}

function shorten(text: string | null, max = 120): string {
  if (!text) {
    return "";
  }
  const clean = text.trim();
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max).trimEnd()}…`;
}

/** Convert a backend Business entity into the frontend view model. */
export function adaptBusiness(api: ApiBusiness): Business {
  const primary = api.locations?.find((l) => l.isPrimary) ?? api.locations?.[0];

  const location: BusinessLocation = primary
    ? {
        address: primary.address,
        city: primary.city,
        latitude: Number(primary.latitude),
        longitude: Number(primary.longitude),
      }
    : { address: "", city: "", ...FOCSANI };

  const operatingHours: OperatingHour[] = (primary?.operatingHours ?? [])
    .map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    }))
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  const slugs = (api.categories ?? []).map((c) => c.slug as CategorySlug);
  const galleryFromApi = (api.media ?? [])
    .filter((m) => m.entityType === "GalleryImage")
    .map((m) => resolveUrl(m.fileURL));

  const socialLinks: SocialLinks = {
    facebook: api.socialLinks?.facebook,
    instagram: api.socialLinks?.instagram,
  };

  return {
    businessId: api.businessId,
    slug: api.slug,
    name: api.name,
    primaryCategory: slugs[0] ?? ("produse-locale" as CategorySlug),
    categorySlugs: slugs.length
      ? slugs
      : (["produse-locale"] as CategorySlug[]),
    shortDescription: shorten(api.description),
    description: api.description ?? "",
    status: api.status,
    contactPhone: api.contactPhone ?? "",
    contactEmail: api.contactEmail ?? "",
    websiteUrl: api.websiteURL ?? undefined,
    socialLinks,
    location,
    operatingHours,
    coverImage: pickMedia(api.media, "Cover") ?? placeholderCover(api.slug),
    logoImage: pickMedia(api.media, "Logo") ?? placeholderLogo(api.slug),
    gallery: galleryFromApi.length
      ? galleryFromApi
      : Array.from({ length: 6 }, (_, i) => placeholderShot(api.slug, i + 1)),
    rating: 0,
    reviewCount: 0,
    featured: false,
    submittedAt: (api.createdAt ?? "").slice(0, 10),
  };
}
