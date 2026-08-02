import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import Instagram from "@mui/icons-material/Instagram";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Logo from "../common/Logo";
import { categoryOrder, categoryMeta } from "../../data/categories";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Explorează",
    links: [
      { label: "Harta interactivă", to: "/harta" },
      { label: "Afaceri locale", to: "/director" },
      { label: "Categorii", to: "/director" },
    ],
  },
  {
    title: "Pentru afaceri",
    links: [
      { label: "Adaugă afacerea", to: "/inregistrare" },
      { label: "Autentificare", to: "/autentificare" },
      { label: "Panou comerciant", to: "/cont" },
    ],
  },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        color: "rgba(255,255,255,0.82)",
        background: "linear-gradient(160deg, #2E2320 0%, #3A241F 100%)",
      }}
    >
      <Container sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 4, md: 5 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1.6fr 1fr 1fr",
              md: "1.8fr 1fr 1fr 1.2fr",
            },
          }}
        >
          <Box>
            <Logo onDark />
            <Typography
              variant="body2"
              sx={{ mt: 2, maxWidth: 320, color: "rgba(255,255,255,0.68)" }}
            >
              Harta digitală a afacerilor, producătorilor și punctelor de
              interes din județul Vrancea. Descoperă și susține economia locală.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
              <IconButton
                size="small"
                aria-label="Facebook"
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)" }}
              >
                <FacebookRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Instagram"
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)" }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Email"
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)" }}
              >
                <EmailRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {columns.map((col) => (
            <Box key={col.title}>
              <Typography variant="overline" sx={{ color: "#E9C877" }}>
                {col.title}
              </Typography>
              <Stack spacing={1.1} sx={{ mt: 1.5 }}>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    component={RouterLink}
                    to={l.to}
                    underline="none"
                    sx={{
                      color: "rgba(255,255,255,0.78)",
                      fontWeight: 500,
                      "&:hover": { color: "#fff" },
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </Stack>
            </Box>
          ))}

          <Box>
            <Typography variant="overline" sx={{ color: "#E9C877" }}>
              Categorii populare
            </Typography>
            <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {categoryOrder.slice(0, 6).map((slug) => (
                <Link
                  key={slug}
                  component={RouterLink}
                  to="/director"
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.78)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    px: 1.1,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.06)",
                    "&:hover": {
                      color: "#fff",
                      bgcolor: "rgba(255,255,255,0.12)",
                    },
                  }}
                >
                  {categoryMeta[slug].shortLabel}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.12)" }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)" }}>
            © {new Date().getFullYear()} Made in Vrancea. Toate drepturile
            rezervate.
          </Typography>
          <Stack direction="row" spacing={2.5}>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
            >
              Termeni
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
            >
              Confidențialitate
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
            >
              Contact
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
