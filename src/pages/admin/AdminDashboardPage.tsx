import { useState } from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import InventoryRoundedIcon from "@mui/icons-material/Inventory2Rounded";
import type { Business } from "../../types";
import {
  pendingBusinesses,
  activeBusinesses,
  businesses,
} from "../../data/mockData";
import { categoryOrder } from "../../data/categories";
import CategoryChip from "../../components/common/CategoryChip";
import SmartImage from "../../components/common/SmartImage";

interface Stat {
  icon: SvgIconComponent;
  value: number;
  label: string;
  color: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const [queue, setQueue] = useState<Business[]>(pendingBusinesses);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const stats: Stat[] = [
    {
      icon: HourglassTopRoundedIcon,
      value: queue.length,
      label: "În așteptare",
      color: "#C7853A",
    },
    {
      icon: StorefrontRoundedIcon,
      value: activeBusinesses.length,
      label: "Afaceri active",
      color: "#3B7A57",
    },
    {
      icon: PeopleRoundedIcon,
      value: 128,
      label: "Utilizatori",
      color: "#3A6EA5",
    },
    {
      icon: CategoryRoundedIcon,
      value: categoryOrder.length,
      label: "Categorii",
      color: "#6B4EA0",
    },
  ];

  const handleAction = (id: string, action: "approve" | "reject") => {
    const target = queue.find((b) => b.businessId === id);
    setQueue((prev) => prev.filter((b) => b.businessId !== id));
    setToast({
      open: true,
      message:
        action === "approve"
          ? `„${target?.name}” a fost aprobată și publicată.`
          : `„${target?.name}” a fost respinsă.`,
      severity: action === "approve" ? "success" : "info",
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Validare afaceri
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Verifică și aprobă afacerile noi înainte de publicarea pe hartă.
      </Typography>

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          mb: 4,
        }}
      >
        {stats.map((s) => (
          <Paper
            key={s.label}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={1.75} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  color: s.color,
                  bgcolor: alpha(s.color, 0.14),
                }}
              >
                <s.icon />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  {s.label}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Coadă de așteptare
      </Typography>

      {queue.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <InventoryRoundedIcon
            sx={{ fontSize: 46, color: "text.secondary", mb: 1.5 }}
          />
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Nimic de verificat
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Ai procesat toate afacerile din coadă. Bravo!
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {queue.map((b) => (
            <Paper
              key={b.businessId}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
                <Box sx={{ width: { xs: "100%", md: 200 }, flexShrink: 0 }}>
                  <SmartImage
                    src={b.coverImage}
                    alt={b.name}
                    ratio={16 / 10}
                    radius={12}
                    category={b.primaryCategory}
                  />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      mb: 1,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6">{b.name}</Typography>
                    <CategoryChip
                      slug={b.primaryCategory}
                      variant="soft"
                      useShortLabel
                    />
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1.5 }}
                  >
                    {b.description}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ flexWrap: "wrap", gap: 1, color: "text.secondary" }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: "center" }}
                    >
                      <LocationOnRoundedIcon sx={{ fontSize: "1rem" }} />
                      <Typography variant="body2">{b.location.city}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: "center" }}
                    >
                      <PhoneRoundedIcon sx={{ fontSize: "1rem" }} />
                      <Typography variant="body2">{b.contactPhone}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: "center" }}
                    >
                      <EmailRoundedIcon sx={{ fontSize: "1rem" }} />
                      <Typography variant="body2">{b.contactEmail}</Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.disabled", display: "block", mt: 1 }}
                  >
                    Trimisă pe {formatDate(b.submittedAt)}
                  </Typography>
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", md: "block" } }}
                />
                <Stack
                  direction={{ xs: "row", md: "column" }}
                  spacing={1.25}
                  sx={{ justifyContent: "center", flexShrink: 0 }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckRoundedIcon />}
                    onClick={() => handleAction(b.businessId, "approve")}
                    sx={{ color: "#fff" }}
                  >
                    Aprobă
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseRoundedIcon />}
                    onClick={() => handleAction(b.businessId, "reject")}
                  >
                    Respinge
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Typography
        variant="caption"
        sx={{ color: "text.disabled", display: "block", mt: 3 }}
      >
        {businesses.length} afaceri în total în platformă.
      </Typography>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
