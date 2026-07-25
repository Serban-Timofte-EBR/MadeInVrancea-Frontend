import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface LogoProps {
  onDark?: boolean;
  size?: "small" | "medium" | "large";
}

const dims = {
  small: { box: 30, mark: "0.95rem", title: "1.02rem" },
  medium: { box: 38, mark: "1.15rem", title: "1.2rem" },
  large: { box: 46, mark: "1.4rem", title: "1.5rem" },
};

/** Brand wordmark: an "MV" monogram emblem beside the name. */
export default function Logo({ onDark = false, size = "medium" }: LogoProps) {
  const d = dims[size];
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.15 }}>
      <Box
        aria-hidden
        sx={{
          width: d.box,
          height: d.box,
          borderRadius: "10px 10px 10px 2px",
          display: "grid",
          placeItems: "center",
          color: "#fff",
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: d.mark,
          lineHeight: 1,
          background:
            "linear-gradient(140deg, #A9505A 0%, #8C2F39 55%, #6E2029 100%)",
          boxShadow: "0 6px 16px -8px rgba(140,47,57,0.9)",
        }}
      >
        MV
      </Box>
      <Box sx={{ lineHeight: 1 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: d.title,
            fontWeight: 700,
            letterSpacing: "0.01em",
            color: onDark ? "#fff" : "text.primary",
          }}
        >
          Made in{" "}
          <Box
            component="span"
            sx={{
              fontFamily: "'Fraunces', serif",
              color: onDark ? "#E9C877" : "primary.main",
            }}
          >
            Vrancea
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
