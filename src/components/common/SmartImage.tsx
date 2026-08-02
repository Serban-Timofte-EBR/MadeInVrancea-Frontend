import { useState } from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import type { CategorySlug } from "../../types";
import { getCategoryMeta } from "../../data/categories";

interface SmartImageProps {
  src: string;
  alt: string;
  /** width / height — reserves space to prevent layout shift. */
  ratio?: number;
  category?: CategorySlug;
  radius?: number | string;
  eager?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Image that always reserves its box (fixed aspect ratio) and fades in when
 * loaded, over a category-tinted gradient. This keeps the page perfectly
 * stable — no reflow or "jumping" while images stream in.
 */
export default function SmartImage({
  src,
  alt,
  ratio = 16 / 9,
  category,
  radius = 0,
  eager = false,
  sx,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const tint = category ? getCategoryMeta(category).color : "#8C2F39";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        overflow: "hidden",
        borderRadius: radius,
        background: `linear-gradient(135deg, ${alpha(tint, 0.24)} 0%, ${alpha(tint, 0.08)} 100%)`,
        ...sx,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </Box>
  );
}
