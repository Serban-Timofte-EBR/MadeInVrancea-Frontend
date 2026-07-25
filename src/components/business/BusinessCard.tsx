import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { Business } from "../../types";
import { categoryMeta } from "../../data/categories";
import SmartImage from "../common/SmartImage";
import CategoryChip from "../common/CategoryChip";
import OpenNowBadge from "../common/OpenNowBadge";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const meta = categoryMeta[business.primaryCategory];

  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        willChange: "transform",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
          borderColor: "transparent",
        },
        "&:focus-within": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/afaceri/${business.slug}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <SmartImage
            src={business.coverImage}
            alt={business.name}
            category={business.primaryCategory}
            ratio={16 / 10}
          />
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <CategoryChip
              slug={business.primaryCategory}
              variant="solid"
              useShortLabel
            />
          </Box>
          <Box sx={{ position: "absolute", bottom: 12, left: 12 }}>
            <OpenNowBadge hours={business.operatingHours} />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2.25,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "1.12rem", lineHeight: 1.25 }}
          >
            {business.name}
          </Typography>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", mt: 0.5, color: "text.secondary" }}
          >
            <LocationOnRoundedIcon sx={{ fontSize: "1rem" }} />
            <Typography variant="body2">{business.location.city}</Typography>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              mt: 1.25,
              color: "text.secondary",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 42,
            }}
          >
            {business.shortDescription}
          </Typography>

          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center", mt: "auto", pt: 1.75 }}
          >
            {business.reviewCount > 0 ? (
              <>
                <Rating
                  value={business.rating}
                  precision={0.1}
                  readOnly
                  size="small"
                  icon={<StarRoundedIcon fontSize="inherit" />}
                  emptyIcon={<StarRoundedIcon fontSize="inherit" />}
                  sx={{ color: "secondary.main" }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {business.rating.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ({business.reviewCount})
                </Typography>
              </>
            ) : (
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: meta.color }}
              >
                Nou pe platformă
              </Typography>
            )}
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
}
