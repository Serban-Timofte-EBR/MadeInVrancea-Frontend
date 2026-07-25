import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
}

export default function SectionHeading({
  overline,
  title,
  subtitle,
  action,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Stack
      direction={{ xs: "column", sm: action ? "row" : "column" }}
      spacing={2}
      sx={{
        mb: { xs: 3, md: 4 },
        alignItems: centered
          ? "center"
          : { xs: "flex-start", sm: action ? "flex-end" : "flex-start" },
        justifyContent: "space-between",
        textAlign: centered ? "center" : "left",
      }}
    >
      <Box sx={{ maxWidth: 640, mx: centered ? "auto" : 0 }}>
        {overline && (
          <Typography
            variant="overline"
            sx={{ color: "secondary.dark", display: "block", mb: 1 }}
          >
            {overline}
          </Typography>
        )}
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: "1.7rem", md: "2.15rem" } }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mt: 1.25 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  );
}
