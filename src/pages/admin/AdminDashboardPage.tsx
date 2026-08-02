import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import InventoryRoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import type { Business } from "../../types";
import { useAsync } from "../../hooks/useAsync";
import * as businessesApi from "../../api/businesses";
import { adaptBusiness } from "../../api/adapters";
import CategoryChip from "../../components/common/CategoryChip";
import SmartImage from "../../components/common/SmartImage";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const {
    data: pending,
    loading: pendingLoading,
    error: pendingError,
    reload: reloadPending,
  } = useAsync(
    async (signal) =>
      (await businessesApi.listPending(signal)).map(adaptBusiness),
    [],
  );

  const queue = pending ?? [];

  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Business | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const approve = async (b: Business) => {
    setBusyId(b.businessId);
    try {
      await businessesApi.approve(b.businessId);
      setToast({
        open: true,
        message: `„${b.name}” a fost aprobată și publicată.`,
        severity: "success",
      });
      reloadPending();
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : "A apărut o eroare.",
        severity: "error",
      });
    } finally {
      setBusyId(null);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) {
      return;
    }
    const b = rejectTarget;
    setBusyId(b.businessId);
    try {
      await businessesApi.reject(
        b.businessId,
        rejectReason.trim() || "Date incomplete sau neconforme.",
      );
      setToast({
        open: true,
        message: `„${b.name}” a fost respinsă.`,
        severity: "info",
      });
      setRejectTarget(null);
      setRejectReason("");
      reloadPending();
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : "A apărut o eroare.",
        severity: "error",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Cereri onboarding
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Verifică și aprobă afacerile noi înainte de publicarea pe hartă.
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Cereri în așteptare
      </Typography>

      {pendingLoading && !pending ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : pendingError ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {pendingError}
        </Alert>
      ) : queue.length === 0 ? (
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
                    onClick={() => approve(b)}
                    disabled={busyId === b.businessId}
                    sx={{ color: "#fff" }}
                  >
                    Aprobă
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseRoundedIcon />}
                    onClick={() => setRejectTarget(b)}
                    disabled={busyId === b.businessId}
                  >
                    Respinge
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Respinge afacerea</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Motivul respingerii va fi comunicat comerciantului „
            {rejectTarget?.name}”.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={2}
            label="Motiv"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setRejectTarget(null)}
            sx={{ color: "text.secondary" }}
          >
            Anulează
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={busyId === rejectTarget?.businessId}
          >
            Respinge
          </Button>
        </DialogActions>
      </Dialog>

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
