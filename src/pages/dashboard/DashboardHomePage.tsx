import { Link as RouterLink } from "react-router-dom";
import type { SvgIconComponent } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getCategoryMeta } from "../../data/categories";
import { useAsync } from "../../hooks/useAsync";
import * as businessesApi from "../../api/businesses";
import { adaptBusiness } from "../../api/adapters";
import { useAuth } from "../../auth/authContext";
import StatusBadge from "../../components/common/StatusBadge";
import SmartImage from "../../components/common/SmartImage";

interface Stat {
  icon: SvgIconComponent;
  value: string;
  label: string;
  trend: string;
}

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data, loading, error } = useAsync(
    (signal) =>
      businessesApi.listMine(signal).then((list) => list.map(adaptBusiness)),
    [],
  );
  const myBusinesses = data ?? [];
  const pending = myBusinesses.filter((b) => b.status === "Pending");
  const activeCount = myBusinesses.filter((b) => b.status === "Active").length;
  const rejectedCount = myBusinesses.filter(
    (b) => b.status === "Rejected",
  ).length;

  const stats: Stat[] = [
    {
      icon: StorefrontRoundedIcon,
      value: String(myBusinesses.length),
      label: "Afaceri",
      trend: "În contul tău",
    },
    {
      icon: CheckCircleRoundedIcon,
      value: String(activeCount),
      label: "Active",
      trend: "Publicate pe hartă",
    },
    {
      icon: HourglassTopRoundedIcon,
      value: String(pending.length),
      label: "În așteptare",
      trend: "La validare",
    },
    {
      icon: BlockRoundedIcon,
      value: String(rejectedCount),
      label: "Respinse",
      trend: "Necesită atenție",
    },
  ];

  const greetingName = user?.firstName ? `, ${user.firstName}` : "";

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Bună{greetingName}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Iată un rezumat al activității afacerilor tale.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/cont/afacere-noua"
          variant="contained"
          startIcon={<AddBusinessRoundedIcon />}
        >
          Adaugă afacere
        </Button>
      </Stack>

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
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                color: "primary.main",
                bgcolor: alpha("#8C2F39", 0.1),
                mb: 1.5,
              }}
            >
              <s.icon />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}
            >
              {s.value}
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
              {s.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "success.main", fontWeight: 700 }}
            >
              {s.trend}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Pending notice */}
      {pending.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha("#C7853A", 0.4),
            bgcolor: alpha("#C7853A", 0.08),
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#8A5A12",
              bgcolor: alpha("#C7853A", 0.2),
            }}
          >
            <HourglassTopRoundedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Verificare în curs</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              „{pending[0].name}” este în curs de validare de către echipa Made
              in Vrancea. Vei fi notificat după aprobare.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* My businesses */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Afacerile mele
      </Typography>
      {loading && (
        <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && myBusinesses.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Nicio afacere încă
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
            Adaugă prima ta afacere pentru a apărea pe harta Vrancei.
          </Typography>
          <Button
            component={RouterLink}
            to="/cont/afacere-noua"
            variant="contained"
            startIcon={<AddBusinessRoundedIcon />}
          >
            Adaugă afacere
          </Button>
        </Paper>
      )}
      {!loading && !error && myBusinesses.length > 0 && (
        <Stack spacing={2}>
          {myBusinesses.map((b) => {
            const meta = getCategoryMeta(b.primaryCategory);
            return (
              <Paper
                key={b.businessId}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ alignItems: { sm: "center" } }}
                >
                  <Box sx={{ width: { xs: "100%", sm: 96 }, flexShrink: 0 }}>
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
                        mb: 0.5,
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                        {b.name}
                      </Typography>
                      <StatusBadge status={b.status} />
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ color: meta.color, fontWeight: 600 }}
                    >
                      {meta.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      {b.location.city}
                    </Typography>
                  </Box>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", sm: "block" } }}
                  />
                  <Stack
                    direction={{ xs: "row", sm: "column" }}
                    spacing={1}
                    sx={{ flexShrink: 0 }}
                  >
                    <Button
                      component={RouterLink}
                      to={`/cont/afaceri/${b.businessId}/editare`}
                      variant="outlined"
                      startIcon={<EditRoundedIcon />}
                      sx={{ borderColor: "divider", color: "text.primary" }}
                    >
                      Editează
                    </Button>
                    {b.status === "Active" && (
                      <Button
                        component={RouterLink}
                        to={`/afaceri/${b.slug}`}
                        variant="text"
                        startIcon={<OpenInNewRoundedIcon />}
                      >
                        Vezi profilul
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
