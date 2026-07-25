import { useEffect, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DirectionsRoundedIcon from "@mui/icons-material/DirectionsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import type { Business, CategorySlug } from "../../types";
import { categoryMeta } from "../../data/categories";
import SmartImage from "../common/SmartImage";
import CategoryChip from "../common/CategoryChip";

const FOCSANI: [number, number] = [45.6966, 27.1863];

/* ---- category-coloured teardrop pins (built once, cached) ---- */
const iconCache = new Map<CategorySlug, L.DivIcon>();

function getPinIcon(slug: CategorySlug): L.DivIcon {
  const cached = iconCache.get(slug);
  if (cached) return cached;
  const meta = categoryMeta[slug];
  const Icon = meta.icon;
  const svg = renderToStaticMarkup(<Icon />);
  const icon = L.divIcon({
    className: "",
    html: `<div class="miv-pin" style="background:${meta.color}">${svg}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34],
  });
  iconCache.set(slug, icon);
  return icon;
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(points, { padding: [50, 50] });
  }, [map, points]);
  return null;
}

function PreviewCard({ business }: { business: Business }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${business.location.latitude},${business.location.longitude}`;
  return (
    <Box sx={{ width: 260 }}>
      <SmartImage
        src={business.coverImage}
        alt={business.name}
        category={business.primaryCategory}
        ratio={2}
        eager
      />
      <Box sx={{ p: 1.75 }}>
        <CategoryChip
          slug={business.primaryCategory}
          variant="soft"
          useShortLabel
        />
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mt: 1, lineHeight: 1.25 }}
        >
          {business.name}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: "center", color: "text.secondary", mt: 0.25 }}
        >
          <LocationOnRoundedIcon sx={{ fontSize: "0.95rem" }} />
          <Typography variant="caption">{business.location.address}</Typography>
        </Stack>
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Button
            component={RouterLink}
            to={`/afaceri/${business.slug}`}
            variant="contained"
            size="small"
            fullWidth
          >
            Vezi profilul
          </Button>
          <Button
            component="a"
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<DirectionsRoundedIcon />}
          >
            Navighează
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

interface MapViewProps {
  businesses: Business[];
  height?: number | string;
  center?: [number, number];
  zoom?: number;
  fitToMarkers?: boolean;
  scrollWheelZoom?: boolean;
  borderRadius?: number | string;
}

export default function MapView({
  businesses,
  height = "100%",
  center = FOCSANI,
  zoom = 10,
  fitToMarkers = true,
  scrollWheelZoom = true,
  borderRadius = 0,
}: MapViewProps) {
  const points = useMemo<[number, number][]>(
    () => businesses.map((b) => [b.location.latitude, b.location.longitude]),
    [businesses],
  );

  return (
    <Box
      sx={{
        height,
        width: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {fitToMarkers && <FitBounds points={points} />}
        {businesses.map((b) => (
          <Marker
            key={b.businessId}
            position={[b.location.latitude, b.location.longitude]}
            icon={getPinIcon(b.primaryCategory)}
          >
            <Popup>
              <PreviewCard business={b} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
