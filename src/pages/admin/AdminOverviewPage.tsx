import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
import * as businessesApi from "../../api/businesses";
import type { ApiBusiness } from "../../api/types";
import * as categoriesApi from "../../api/categories";
import * as usersApi from "../../api/users";
import StatusBadge from "../../components/common/StatusBadge";
import { useAsync } from "../../hooks/useAsync";

interface Stat {
  label: string;
  value: number;
  icon: SvgIconComponent;
  color: string;
}

export default function AdminOverviewPage() {
  const { data, loading, error, reload } = useAsync(async (signal) => {
    const [businesses, users, categories] = await Promise.all([
      businessesApi.listAllForAdmin(signal),
      usersApi.list(signal),
      categoriesApi.list(signal),
    ]);
    return { businesses, users, categories };
  }, []);
  const [statusTarget, setStatusTarget] = useState<ApiBusiness | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const changePublicationStatus = async () => {
    if (!statusTarget) return;

    const suspending = statusTarget.status === "Active";
    setBusy(true);
    try {
      if (suspending) {
        await businessesApi.suspend(statusTarget.businessId);
      } else {
        await businessesApi.approve(statusTarget.businessId);
      }
      setToast({
        message: suspending
          ? `„${statusTarget.name}” nu mai este vizibilă public.`
          : `„${statusTarget.name}” este din nou publicată.`,
        severity: "success",
      });
      setStatusTarget(null);
      reload();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "A apărut o eroare.",
        severity: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const businesses = data?.businesses ?? [];
  const stats: Stat[] = [
    {
      label: "Total afaceri",
      value: businesses.length,
      icon: StorefrontRoundedIcon,
      color: "#3A6EA5",
    },
    {
      label: "Afaceri active",
      value: businesses.filter((business) => business.status === "Active")
        .length,
      icon: StorefrontRoundedIcon,
      color: "#3B7A57",
    },
    {
      label: "În așteptare",
      value: businesses.filter((business) => business.status === "Pending")
        .length,
      icon: HourglassTopRoundedIcon,
      color: "#C7853A",
    },
    {
      label: "Utilizatori",
      value: data?.users.length ?? 0,
      icon: PeopleRoundedIcon,
      color: "#8C2F39",
    },
    {
      label: "Categorii",
      value: data?.categories.length ?? 0,
      icon: CategoryRoundedIcon,
      color: "#6B4EA0",
    },
  ];

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Panou principal
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Situația afacerilor și activitatea platformei.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/admin/afacere-noua"
          variant="contained"
          startIcon={<AddBusinessRoundedIcon />}
        >
          Adaugă afacere
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && !data ? (
        <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(5, minmax(0, 1fr))",
              },
              gap: 2,
              mb: 4,
            }}
          >
            {stats.map((stat) => (
              <Paper
                key={stat.label}
                elevation={0}
                sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}
              >
                <stat.icon
                  sx={{
                    color: stat.color,
                    bgcolor: alpha(stat.color, 0.12),
                    p: 1,
                    borderRadius: 2,
                    fontSize: 42,
                    mb: 1.5,
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Toate afacerile
          </Typography>
          <Stack spacing={1.5}>
            {businesses.map((business) => {
              const location =
                business.locations.find((item) => item.isPrimary) ??
                business.locations[0];
              return (
                <Paper
                  key={business.businessId}
                  elevation={0}
                  sx={{ p: 2, border: "1px solid", borderColor: "divider" }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: { sm: "center" },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>
                        {business.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {business.categories[0]?.name ?? "Fără categorie"}
                        {location?.city ? ` · ${location.city}` : ""}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", flexShrink: 0 }}
                    >
                      <StatusBadge status={business.status} />
                      {business.status === "Active" && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<BlockRoundedIcon />}
                          onClick={() => setStatusTarget(business)}
                        >
                          Suspendă
                        </Button>
                      )}
                      {business.status === "Suspended" && (
                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          startIcon={<CheckCircleRoundedIcon />}
                          onClick={() => setStatusTarget(business)}
                        >
                          Reactivează
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </>
      )}

      <Dialog
        open={Boolean(statusTarget)}
        onClose={() => !busy && setStatusTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {statusTarget?.status === "Active"
            ? "Suspendă afacerea"
            : "Reactivează afacerea"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {statusTarget?.status === "Active"
              ? `„${statusTarget?.name}” va fi eliminată de pe site-ul public până la reactivare.`
              : `„${statusTarget?.name}” va fi publicată din nou pe site.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setStatusTarget(null)} disabled={busy}>
            Anulează
          </Button>
          <Button
            onClick={changePublicationStatus}
            variant="contained"
            color={statusTarget?.status === "Active" ? "error" : "success"}
            disabled={busy}
          >
            {statusTarget?.status === "Active" ? "Suspendă" : "Reactivează"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast?.severity ?? "success"} variant="filled">
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
