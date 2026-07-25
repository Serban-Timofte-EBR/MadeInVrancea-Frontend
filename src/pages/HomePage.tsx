import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { CategorySlug } from "../types";
import { categoryOrder, categoryMeta } from "../data/categories";
import {
  activeBusinesses,
  featuredBusinesses,
  categoryList,
  getBusinessBySlug,
} from "../data/mockData";
import SearchBar from "../components/common/SearchBar";
import SectionHeading from "../components/common/SectionHeading";
import CategoryFilter from "../components/common/CategoryFilter";
import BusinessCard from "../components/business/BusinessCard";
import SmartImage from "../components/common/SmartImage";
import MapView from "../components/map/MapView";

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CategorySlug[]>([]);

  const heroImage = getBusinessBySlug("crama-girboiu")?.coverImage ?? "";
  const cityCount = useMemo(
    () => new Set(activeBusinesses.map((b) => b.location.city)).size,
    [],
  );

  const mapBusinesses = useMemo(
    () =>
      selected.length === 0
        ? activeBusinesses
        : activeBusinesses.filter((b) =>
            b.categorySlugs.some((c) => selected.includes(c)),
          ),
    [selected],
  );

  const toggle = (slug: CategorySlug) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const submitSearch = () =>
    navigate(`/director?q=${encodeURIComponent(query.trim())}`);

  const stats = [
    { value: `${activeBusinesses.length}+`, label: "Afaceri listate" },
    { value: categoryOrder.length, label: "Categorii" },
    { value: cityCount, label: "Localități" },
  ];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(120% 120% at 85% 0%, rgba(199,154,58,0.14) 0%, rgba(199,154,58,0) 45%), linear-gradient(180deg, #FBF8F4 0%, #F6EFE7 100%)",
        }}
      >
        <Container sx={{ py: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
              gap: { xs: 5, md: 6 },
              alignItems: "center",
            }}
          >
            <Box>
              <Chip
                label="Județul Vrancea · Directorul digital"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  bgcolor: alpha("#8C2F39", 0.08),
                  mb: 2.5,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.4rem", sm: "3rem", md: "3.6rem" },
                  mb: 2,
                }}
              >
                Descoperă afacerile locale din inima{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  Vrancei
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  color: "text.secondary",
                  maxWidth: 520,
                  mb: 3.5,
                }}
              >
                Crame, restaurante, pensiuni și meșteșugari, toate pe o singură
                hartă interactivă. Explorează, contactează și susține economia
                locală.
              </Typography>

              <Box sx={{ maxWidth: 560, mb: 2 }}>
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSubmit={submitSearch}
                />
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mb: 4.5 }}
              >
                <Button
                  size="large"
                  variant="contained"
                  onClick={submitSearch}
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  Caută în director
                </Button>
                <Button
                  component={RouterLink}
                  to="/harta"
                  size="large"
                  variant="outlined"
                >
                  Deschide harta
                </Button>
              </Stack>

              <Stack direction="row" spacing={{ xs: 3, sm: 5 }}>
                {stats.map((s) => (
                  <Box key={s.label}>
                    <Typography variant="h4" sx={{ color: "primary.main" }}>
                      {s.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Decorative framed visual (single eager image, fixed ratio → no CLS) */}
            <Box
              sx={{
                position: "relative",
                display: { xs: "none", sm: "block" },
              }}
            >
              <Box
                sx={{
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: 10,
                  transform: "rotate(1.4deg)",
                  border: "6px solid #fff",
                }}
              >
                <SmartImage
                  src={heroImage}
                  alt="Podgorie din Vrancea"
                  ratio={4 / 5}
                  eager
                  category="crame"
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 18,
                  left: -18,
                  bgcolor: "#fff",
                  borderRadius: 3,
                  boxShadow: 6,
                  px: 2,
                  py: 1.25,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <StarRoundedIcon sx={{ color: "secondary.main" }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>
                    4.8 / 5
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Recenzii verificate
                  </Typography>
                </Box>
              </Box>
              <Chip
                icon={<StorefrontRoundedIcon />}
                label="Profil gratuit"
                sx={{
                  position: "absolute",
                  top: 18,
                  right: -10,
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow: 4,
                  "& .MuiChip-icon": { color: "#fff" },
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ---------- Interactive map ---------- */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container>
          <SectionHeading
            overline="Harta interactivă"
            title="Explorează Vrancea pe hartă"
            subtitle="Filtrează după categorie și apasă pe un pin pentru detalii rapide și direcții."
            action={
              <Button
                component={RouterLink}
                to="/harta"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                Vezi harta completă
              </Button>
            }
          />
          <Box sx={{ mb: 2.5 }}>
            <CategoryFilter
              selected={selected}
              onToggle={toggle}
              onClear={() => setSelected([])}
            />
          </Box>
          <Box
            sx={{
              height: { xs: 380, md: 520 },
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 4,
            }}
          >
            <MapView businesses={mapBusinesses} height="100%" />
          </Box>
        </Container>
      </Box>

      {/* ---------- Categories ---------- */}
      <Box sx={{ py: { xs: 6, md: 9 }, bgcolor: alpha("#8C2F39", 0.03) }}>
        <Container>
          <SectionHeading
            overline="Categorii"
            title="Ce cauți astăzi?"
            align="center"
          />
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(5, 1fr)",
              },
            }}
          >
            {categoryList.map((cat) => {
              const meta = categoryMeta[cat.slug];
              const Icon = meta.icon;
              return (
                <Box
                  key={cat.slug}
                  component={RouterLink}
                  to={`/director?cat=${cat.slug}`}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: "#fff",
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.25,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 4,
                      borderColor: "transparent",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      color: meta.color,
                      bgcolor: alpha(meta.color, 0.12),
                    }}
                  >
                    <Icon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {meta.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {cat.count} {cat.count === 1 ? "afacere" : "afaceri"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ---------- Featured ---------- */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container>
          <SectionHeading
            overline="Recomandate"
            title="Afaceri de descoperit"
            subtitle="O selecție a locurilor apreciate de comunitate."
            action={
              <Button
                component={RouterLink}
                to="/director"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                Vezi toate
              </Button>
            }
          />
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {featuredBusinesses.map((b) => (
              <BusinessCard key={b.businessId} business={b} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ---------- Merchant CTA ---------- */}
      <Container sx={{ pb: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 5,
            p: { xs: 4, md: 7 },
            color: "#fff",
            background: "linear-gradient(135deg, #8C2F39 0%, #6E2029 100%)",
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(60% 120% at 90% 10%, rgba(199,154,58,0.35) 0%, rgba(199,154,58,0) 55%)",
            }}
          />
          <Box sx={{ position: "relative", maxWidth: 640 }}>
            <Typography variant="overline" sx={{ color: "#E9C877" }}>
              Pentru comercianți
            </Typography>
            <Typography
              variant="h3"
              sx={{ mt: 1, mb: 1.5, fontSize: { xs: "1.8rem", md: "2.4rem" } }}
            >
              Ai o afacere în Vrancea? Adaug-o gratuit.
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.85)", mb: 3.5, maxWidth: 520 }}
            >
              Creează-ți profilul public în câțiva pași, apari pe hartă și fii
              găsit de mii de vizitatori și turiști din regiune.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                component={RouterLink}
                to="/inregistrare"
                size="large"
                variant="contained"
                startIcon={<StorefrontRoundedIcon />}
                sx={{
                  bgcolor: "#fff",
                  color: "primary.main",
                  "&:hover": { bgcolor: "#F4E9D8" },
                }}
              >
                Adaugă afacerea
              </Button>
              <Button
                component={RouterLink}
                to="/autentificare"
                size="large"
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.6)",
                  "&:hover": { borderColor: "#fff" },
                }}
              >
                Am deja cont
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
}
