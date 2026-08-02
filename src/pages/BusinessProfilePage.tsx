import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import { alpha } from "@mui/material/styles";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import DirectionsRoundedIcon from "@mui/icons-material/DirectionsRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import Instagram from "@mui/icons-material/Instagram";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { getCategoryMeta } from "../data/categories";
import { useAsync } from "../hooks/useAsync";
import * as businessesApi from "../api/businesses";
import { adaptBusiness } from "../api/adapters";
import { DAY_NAMES_RO, currentDayOfWeek, formatHours } from "../lib/hours";
import CategoryChip from "../components/common/CategoryChip";
import OpenNowBadge from "../components/common/OpenNowBadge";
import SmartImage from "../components/common/SmartImage";
import MapView from "../components/map/MapView";

export default function BusinessProfilePage() {
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const {
    data: business,
    loading,
    error,
  } = useAsync(
    (signal) => businessesApi.getBySlug(slug ?? "", signal).then(adaptBusiness),
    [slug],
  );

  if (loading) {
    return (
      <Container sx={{ py: 12, display: "grid", placeItems: "center" }}>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  if (error || !business) {
    return (
      <Container sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 1.5 }}>
          Afacerea nu a fost găsită
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Profilul căutat nu există sau a fost eliminat.
        </Typography>
        <Button component={RouterLink} to="/director" variant="contained">
          Înapoi la director
        </Button>
      </Container>
    );
  }

  const today = currentDayOfWeek();
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${business.location.latitude},${business.location.longitude}`;
  const gallery = business.gallery;

  const closeLightbox = () => setLightbox(null);
  const step = (delta: number) =>
    setLightbox((i) =>
      i === null ? null : (i + delta + gallery.length) % gallery.length,
    );

  const contactRows = [
    {
      icon: <PhoneRoundedIcon />,
      label: business.contactPhone,
      href: `tel:${business.contactPhone.replace(/\s/g, "")}`,
    },
    {
      icon: <EmailRoundedIcon />,
      label: business.contactEmail,
      href: `mailto:${business.contactEmail}`,
    },
    ...(business.websiteUrl
      ? [
          {
            icon: <LanguageRoundedIcon />,
            label: business.websiteUrl.replace(/^https?:\/\//, ""),
            href: business.websiteUrl,
          },
        ]
      : []),
  ];

  return (
    <Container sx={{ py: { xs: 2, md: 3 } }}>
      <Button
        component={RouterLink}
        to="/director"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ color: "text.secondary", mb: 1.5 }}
      >
        Înapoi la director
      </Button>

      {/* Cover — fixed responsive height keeps layout perfectly stable */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 190, sm: 280, md: 340 },
          borderRadius: 4,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${alpha(getCategoryMeta(business.primaryCategory).color, 0.3)}, ${alpha(
            getCategoryMeta(business.primaryCategory).color,
            0.1,
          )})`,
        }}
      >
        <Box
          component="img"
          src={business.coverImage}
          alt={business.name}
          loading="eager"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </Box>

      {/* Header card */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 2,
          mt: { xs: -5, md: -7 },
          mx: { xs: 1, md: 3 },
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 6,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          sx={{ alignItems: { md: "center" } }}
        >
          <Avatar
            src={business.logoImage}
            alt={`Logo ${business.name}`}
            variant="rounded"
            sx={{
              width: { xs: 68, md: 92 },
              height: { xs: 68, md: 92 },
              borderRadius: 3,
              border: "4px solid #fff",
              boxShadow: 3,
            }}
          />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" }, mb: 1 }}
            >
              {business.name}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
            >
              {business.categorySlugs.map((c) => (
                <CategoryChip key={c} slug={c} variant="soft" />
              ))}
              <OpenNowBadge hours={business.operatingHours} />
              {business.reviewCount > 0 && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <StarRoundedIcon
                    sx={{ color: "secondary.main", fontSize: "1.2rem" }}
                  />
                  <Typography sx={{ fontWeight: 700 }}>
                    {business.rating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    ({business.reviewCount} recenzii)
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", color: "text.secondary", mt: 1 }}
            >
              <LocationOnRoundedIcon sx={{ fontSize: "1.05rem" }} />
              <Typography variant="body2">
                {business.location.address}, {business.location.city}
              </Typography>
            </Stack>
          </Box>
          <Stack
            direction={{ xs: "row", md: "column" }}
            spacing={1.25}
            sx={{ flexShrink: 0 }}
          >
            <Button
              component="a"
              href={`tel:${business.contactPhone.replace(/\s/g, "")}`}
              variant="contained"
              startIcon={<PhoneRoundedIcon />}
              fullWidth
            >
              Sună acum
            </Button>
            <Button
              component="a"
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<DirectionsRoundedIcon />}
              fullWidth
            >
              Navighează
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Body */}
      <Box
        sx={{
          mt: { xs: 3, md: 4 },
          display: "grid",
          gap: { xs: 3, md: 4 },
          gridTemplateColumns: { xs: "1fr", md: "1.7fr 1fr" },
          alignItems: "start",
        }}
      >
        {/* Main column */}
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1.5 }}>
              Despre
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "1.02rem" }}>
              {business.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Galerie foto
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                },
              }}
            >
              {gallery.map((src, i) => (
                <Box
                  key={src}
                  onClick={() => setLightbox(i)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <SmartImage
                    src={src}
                    alt={`${business.name} — fotografia ${i + 1}`}
                    ratio={1}
                    category={business.primaryCategory}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Locație
            </Typography>
            <Box
              sx={{
                height: 300,
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <MapView
                businesses={[business]}
                height="100%"
                zoom={14}
                scrollWheelZoom={false}
              />
            </Box>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: "center", mt: 1.5, color: "text.secondary" }}
            >
              <LocationOnRoundedIcon sx={{ fontSize: "1.05rem" }} />
              <Typography variant="body2">
                {business.location.address}, {business.location.city}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Sidebar */}
        <Stack spacing={3} sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.75,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Contact
            </Typography>
            <Stack spacing={1.5}>
              {contactRows.map((row) => (
                <Link
                  key={row.label}
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "text.primary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Box sx={{ color: "primary.main", display: "flex" }}>
                    {row.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                    {row.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
            {(business.socialLinks.facebook ||
              business.socialLinks.instagram) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1}>
                  {business.socialLinks.facebook && (
                    <IconButton
                      component="a"
                      href={business.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      sx={{
                        bgcolor: alpha("#8C2F39", 0.08),
                        color: "primary.main",
                      }}
                    >
                      <FacebookRoundedIcon />
                    </IconButton>
                  )}
                  {business.socialLinks.instagram && (
                    <IconButton
                      component="a"
                      href={business.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      sx={{
                        bgcolor: alpha("#8C2F39", 0.08),
                        color: "primary.main",
                      }}
                    >
                      <Instagram />
                    </IconButton>
                  )}
                </Stack>
              </>
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.75,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="h6">Program</Typography>
              <OpenNowBadge hours={business.operatingHours} />
            </Stack>
            <Stack spacing={0.25}>
              {business.operatingHours.map((h) => {
                const isToday = h.dayOfWeek === today;
                return (
                  <Stack
                    key={h.dayOfWeek}
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      py: 0.75,
                      px: 1,
                      borderRadius: 1.5,
                      bgcolor: isToday ? alpha("#8C2F39", 0.06) : "transparent",
                    }}
                  >
                    <Typography sx={{ fontWeight: isToday ? 700 : 500 }}>
                      {DAY_NAMES_RO[h.dayOfWeek - 1]}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: isToday ? 700 : 500,
                        color: h.isClosed ? "text.disabled" : "text.primary",
                      }}
                    >
                      {formatHours(h)}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        </Stack>
      </Box>

      {/* Lightbox */}
      <Dialog
        open={lightbox !== null}
        onClose={closeLightbox}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: "relative", bgcolor: "#1c1512" }}>
          <IconButton
            onClick={closeLightbox}
            aria-label="Închide"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 3,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.4)",
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          <IconButton
            onClick={() => step(-1)}
            aria-label="Anterioară"
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              zIndex: 3,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.4)",
            }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <IconButton
            onClick={() => step(1)}
            aria-label="Următoarea"
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              zIndex: 3,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.4)",
            }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
          {lightbox !== null && (
            <SmartImage
              src={gallery[lightbox]}
              alt={`${business.name} — fotografie`}
              ratio={3 / 2}
              eager
            />
          )}
        </Box>
      </Dialog>
    </Container>
  );
}
