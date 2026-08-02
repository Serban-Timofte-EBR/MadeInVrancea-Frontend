import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import type { CategorySlug } from "../../types";
import { categoryOrder, categoryMeta } from "../../data/categories";

interface CategoryFilterProps {
  selected: CategorySlug[];
  onToggle: (slug: CategorySlug) => void;
  onClear: () => void;
  direction?: "row" | "column";
  showCounts?: boolean;
  counts?: Record<string, number>;
}

export default function CategoryFilter({
  selected,
  onToggle,
  onClear,
  direction = "row",
  showCounts = false,
  counts = {},
}: CategoryFilterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        flexWrap: direction === "row" ? "wrap" : "nowrap",
        gap: 1,
      }}
    >
      <Chip
        label="Toate"
        onClick={onClear}
        sx={{
          fontWeight: 700,
          justifyContent: direction === "column" ? "flex-start" : "center",
          bgcolor: selected.length === 0 ? "primary.main" : "transparent",
          color: selected.length === 0 ? "#fff" : "text.primary",
          border: selected.length === 0 ? "none" : "1px solid",
          borderColor: "divider",
          "&:hover": {
            bgcolor: selected.length === 0 ? "primary.dark" : "action.hover",
          },
        }}
      />
      {categoryOrder.map((slug) => {
        const meta = categoryMeta[slug];
        const Icon = meta.icon;
        const active = selected.includes(slug);
        return (
          <Chip
            key={slug}
            icon={<Icon />}
            label={
              showCounts ? `${meta.label} · ${counts[slug] ?? 0}` : meta.label
            }
            onClick={() => onToggle(slug)}
            sx={{
              fontWeight: 600,
              justifyContent: direction === "column" ? "flex-start" : "center",
              bgcolor: active ? meta.color : "transparent",
              color: active ? "#fff" : "text.primary",
              border: active ? "none" : "1px solid",
              borderColor: "divider",
              "& .MuiChip-icon": { color: active ? "#fff" : meta.color },
              "&:hover": {
                bgcolor: active ? meta.color : alpha(meta.color, 0.1),
              },
            }}
          />
        );
      })}
    </Box>
  );
}
