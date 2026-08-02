import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import type { CategorySlug } from "../../types";
import { getCategoryMeta } from "../../data/categories";

interface CategoryChipProps {
  slug: CategorySlug;
  size?: "small" | "medium";
  variant?: "soft" | "solid" | "outline";
  useShortLabel?: boolean;
  onClick?: () => void;
}

export default function CategoryChip({
  slug,
  size = "small",
  variant = "soft",
  useShortLabel = false,
  onClick,
}: CategoryChipProps) {
  const meta = getCategoryMeta(slug);
  const Icon = meta.icon;

  const styles =
    variant === "solid"
      ? {
          bgcolor: meta.color,
          color: "#fff",
          "& .MuiChip-icon": { color: "#fff" },
        }
      : variant === "outline"
        ? {
            bgcolor: "transparent",
            color: meta.color,
            border: `1px solid ${alpha(meta.color, 0.4)}`,
            "& .MuiChip-icon": { color: meta.color },
          }
        : {
            bgcolor: alpha(meta.color, 0.12),
            color: meta.color,
            "& .MuiChip-icon": { color: meta.color },
          };

  return (
    <Chip
      size={size}
      icon={<Icon />}
      label={useShortLabel ? meta.shortLabel : meta.label}
      onClick={onClick}
      sx={{
        fontWeight: 600,
        border: "none",
        ...styles,
        ...(onClick && { cursor: "pointer" }),
      }}
    />
  );
}
