import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import type { CategorySlug } from "../types";
import { getCategoryMeta } from "../data/categories";
import { useAsync } from "../hooks/useAsync";
import * as businessesApi from "../api/businesses";
import { adaptBusiness } from "../api/adapters";
import CategoryFilter from "../components/common/CategoryFilter";
import MapView from "../components/map/MapView";

export default function MapPage() {
  const [selected, setSelected] = useState<CategorySlug[]>([]);

  const { data, loading, error } = useAsync(
    (signal) =>
      businessesApi
        .listActive({ limit: 100 }, signal)
        .then((res) => res.data.map(adaptBusiness)),
    [],
  );
  const businesses = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(
    () =>
      selected.length === 0
        ? businesses
        : businesses.filter((b) =>
            b.categorySlugs.some((c) => selected.includes(c)),
          ),
    [businesses, selected],
  );

  const toggle = (slug: CategorySlug) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: { xs: "calc(100dvh - 62px)", md: "calc(100dvh - 72px)" },
      }}
    >
      {/* Sidebar (desktop) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: 360,
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ p: 2.5, pb: 2 }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Harta Vrancei
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {loading
              ? "Se încarcă…"
              : `${filtered.length} ${filtered.length === 1 ? "afacere" : "afaceri"} pe hartă`}
          </Typography>
          <CategoryFilter
            selected={selected}
            onToggle={toggle}
            onClear={() => setSelected([])}
            direction="column"
          />
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1.5 }}>
          <Stack spacing={1}>
            {filtered.map((b) => {
              const meta = getCategoryMeta(b.primaryCategory);
              return (
                <Box
                  key={b.businessId}
                  component={RouterLink}
                  to={`/afaceri/${b.slug}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: 2.5,
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      bgcolor: meta.color,
                    }}
                  >
                    <meta.icon fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                      noWrap
                    >
                      {b.name}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: "center", color: "text.secondary" }}
                    >
                      <LocationOnRoundedIcon sx={{ fontSize: "0.9rem" }} />
                      <Typography variant="caption" noWrap>
                        {b.location.city}
                      </Typography>
                    </Stack>
                  </Box>
                  <ChevronRightRoundedIcon sx={{ color: "text.disabled" }} />
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* Mobile filter bar */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          p: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            minWidth: "min-content",
            "& > *": { flexShrink: 0 },
          }}
        >
          <CategoryFilter
            selected={selected}
            onToggle={toggle}
            onClear={() => setSelected([])}
          />
        </Box>
      </Box>

      {/* Map */}
      <Box
        sx={{ flexGrow: 1, position: "relative", bgcolor: alpha("#000", 0.02) }}
      >
        {error ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              p: 3,
              zIndex: 500,
            }}
          >
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {error}
            </Alert>
          </Box>
        ) : loading ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 500,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <MapView businesses={filtered} height="100%" />
        )}
      </Box>
    </Box>
  );
}
