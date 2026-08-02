import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Logo from "../common/Logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const benefits = [
  "Profil public gratuit, indexabil de Google",
  "Prezență pe harta interactivă a județului",
  "Statistici despre vizitatorii profilului tău",
];

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        minHeight: "100dvh",
      }}
    >
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(150deg, #8C2F39 0%, #6E2029 60%, #55181F 100%)",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 90% at 100% 0%, rgba(199,154,58,0.35) 0%, rgba(199,154,58,0) 55%)",
          }}
        />
        <Box sx={{ position: "relative" }}>
          <Logo onDark size="large" />
        </Box>
        <Box sx={{ position: "relative" }}>
          <Typography variant="h2" sx={{ fontSize: "2.6rem", mb: 2 }}>
            Fă-ți afacerea vizibilă în toată Vrancea.
          </Typography>
          <Typography
            sx={{ color: "rgba(255,255,255,0.82)", mb: 4, maxWidth: 420 }}
          >
            Alătură-te comunității locale și conectează-te cu mii de vizitatori,
            turiști și localnici.
          </Typography>
          <Stack spacing={1.5}>
            {benefits.map((b) => (
              <Stack
                key={b}
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <CheckCircleRoundedIcon sx={{ color: "#E9C877" }} />
                <Typography sx={{ fontWeight: 500 }}>{b}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Box sx={{ position: "relative" }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
            © {new Date().getFullYear()} Made in Vrancea
          </Typography>
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        sx={{ display: "flex", flexDirection: "column", p: { xs: 3, sm: 5 } }}
      >
        <Box>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ color: "text.secondary" }}
          >
            Acasă
          </Button>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
              <Logo size="large" />
            </Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 3.5 }}>
              {subtitle}
            </Typography>
            {children}
            <Box sx={{ mt: 3, textAlign: "center" }}>{footer}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
