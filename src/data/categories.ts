import type { SvgIconComponent } from "@mui/icons-material";
import WineBarIcon from "@mui/icons-material/WineBar";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import BuildIcon from "@mui/icons-material/Build";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import PaletteIcon from "@mui/icons-material/Palette";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import type { CategorySlug } from "../types";

export interface CategoryMeta {
  slug: CategorySlug;
  label: string;
  shortLabel: string;
  icon: SvgIconComponent;
  /** Brand-tinted colour used for map pins, chips and accents. */
  color: string;
}

export const categoryMeta: Record<CategorySlug, CategoryMeta> = {
  crame: {
    slug: "crame",
    label: "Crame & Vinării",
    shortLabel: "Crame",
    icon: WineBarIcon,
    color: "#7B2D3A",
  },
  restaurante: {
    slug: "restaurante",
    label: "Restaurante",
    shortLabel: "Restaurante",
    icon: RestaurantIcon,
    color: "#B5482E",
  },
  cazare: {
    slug: "cazare",
    label: "Cazare & Pensiuni",
    shortLabel: "Cazare",
    icon: HotelIcon,
    color: "#3A6EA5",
  },
  "ateliere-auto": {
    slug: "ateliere-auto",
    label: "Ateliere Auto",
    shortLabel: "Auto",
    icon: BuildIcon,
    color: "#4A5568",
  },
  beauty: {
    slug: "beauty",
    label: "Beauty & Îngrijire",
    shortLabel: "Beauty",
    icon: ContentCutIcon,
    color: "#B14A7E",
  },
  cafenele: {
    slug: "cafenele",
    label: "Cafenele",
    shortLabel: "Cafenele",
    icon: LocalCafeIcon,
    color: "#7A5230",
  },
  artizanat: {
    slug: "artizanat",
    label: "Artizanat & Meșteșuguri",
    shortLabel: "Artizanat",
    icon: PaletteIcon,
    color: "#6B4EA0",
  },
  "produse-locale": {
    slug: "produse-locale",
    label: "Produse Locale",
    shortLabel: "Local",
    icon: StorefrontIcon,
    color: "#3B7A57",
  },
  brutarii: {
    slug: "brutarii",
    label: "Brutării & Cofetării",
    shortLabel: "Brutării",
    icon: BakeryDiningIcon,
    color: "#C7853A",
  },
  farmacii: {
    slug: "farmacii",
    label: "Farmacii",
    shortLabel: "Farmacii",
    icon: LocalPharmacyIcon,
    color: "#2E8B8B",
  },
};

/** Stable display order for filters and category grids. */
export const categoryOrder: CategorySlug[] = [
  "crame",
  "restaurante",
  "cazare",
  "produse-locale",
  "artizanat",
  "cafenele",
  "brutarii",
  "beauty",
  "ateliere-auto",
  "farmacii",
];

export function getCategoryMeta(slug: CategorySlug): CategoryMeta {
  return categoryMeta[slug];
}
