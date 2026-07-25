import { useState } from "react";
import { Link as RouterLink, NavLink, Outlet } from "react-router-dom";
import type { SvgIconComponent } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import Logo from "../common/Logo";

type Variant = "merchant" | "admin";

interface NavItem {
  label: string;
  to: string;
  icon: SvgIconComponent;
  end?: boolean;
}

const merchantNav: NavItem[] = [
  {
    label: "Panou principal",
    to: "/cont",
    icon: DashboardRoundedIcon,
    end: true,
  },
  {
    label: "Adaugă afacere",
    to: "/cont/afacere-noua",
    icon: AddBusinessRoundedIcon,
  },
];

const adminNav: NavItem[] = [
  {
    label: "Validare afaceri",
    to: "/admin",
    icon: FactCheckRoundedIcon,
    end: true,
  },
  { label: "Utilizatori", to: "/admin/utilizatori", icon: PeopleRoundedIcon },
  { label: "Categorii", to: "/admin/categorii", icon: CategoryRoundedIcon },
];

const SIDEBAR_WIDTH = 268;

function SidebarContent({
  variant,
  onNavigate,
}: {
  variant: Variant;
  onNavigate?: () => void;
}) {
  const nav = variant === "admin" ? adminNav : merchantNav;
  const user =
    variant === "admin"
      ? { name: "Andrei Ionescu", role: "Administrator" }
      : { name: "Maria Popescu", role: "Comerciant" };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: "inline-flex" }}
          onClick={onNavigate}
        >
          <Logo />
        </Box>
      </Box>
      <Divider />

      <Stack spacing={0.5} sx={{ p: 1.5, flexGrow: 1 }}>
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", px: 1.5, pt: 1 }}
        >
          {variant === "admin" ? "Administrare" : "Contul meu"}
        </Typography>
        {nav.map((item) => (
          <Box
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.75,
              py: 1.25,
              borderRadius: 2.5,
              color: "text.secondary",
              fontWeight: 600,
              transition: "background-color 0.15s ease, color 0.15s ease",
              "&:hover": { bgcolor: "action.hover", color: "text.primary" },
              "&.active": {
                bgcolor: alpha("#8C2F39", 0.1),
                color: "primary.main",
              },
            }}
          >
            <item.icon fontSize="small" />
            <span>{item.label}</span>
          </Box>
        ))}
      </Stack>

      <Box sx={{ p: 1.5 }}>
        <Button
          component={RouterLink}
          to="/"
          fullWidth
          startIcon={<OpenInNewRoundedIcon />}
          variant="outlined"
          sx={{ mb: 1.5, borderColor: "divider", color: "text.primary" }}
        >
          Vezi site-ul public
        </Button>
        <Divider sx={{ mb: 1.5 }} />
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", px: 0.5 }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
            {user.name.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {user.role}
            </Typography>
          </Box>
          <IconButton
            component={RouterLink}
            to="/"
            aria-label="Deconectare"
            size="small"
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

export default function DashboardLayout({ variant }: { variant: Variant }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        bgcolor: "background.default",
      }}
    >
      {/* Permanent sidebar (desktop) */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          borderRight: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          height: "100dvh",
        }}
      >
        <SidebarContent variant={variant} />
      </Box>

      {/* Mobile drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH } } }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <SidebarContent variant={variant} onNavigate={() => setOpen(false)} />
      </Drawer>

      {/* Main */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <IconButton
            edge="start"
            aria-label="Deschide meniul"
            onClick={() => setOpen(true)}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Logo size="small" />
        </Box>
        <Box sx={{ p: { xs: 2.5, md: 4 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
