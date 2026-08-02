import { useState } from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Logo from "../common/Logo";
import { useAuth } from "../../auth/authContext";

const navItems = [
  { label: "Acasă", to: "/" },
  { label: "Harta", to: "/harta" },
  { label: "Director", to: "/director" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const elevated = useScrollTrigger({ disableHysteresis: true, threshold: 8 });
  const { user, logout } = useAuth();
  const accountPath = user?.role === "Admin" ? "/admin" : "/cont";

  const navLinkSx = {
    color: "text.primary",
    fontWeight: 600,
    px: 1.5,
    borderRadius: 999,
    "&.active": { color: "primary.main", bgcolor: "rgba(140,47,57,0.08)" },
  } as const;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        color: "text.primary",
        bgcolor: "rgba(251,248,244,0.82)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: elevated ? "divider" : "transparent",
        boxShadow: elevated ? "0 6px 22px -18px rgba(42,35,32,0.6)" : "none",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ minHeight: { xs: 62, md: 72 }, gap: 2 }}>
          <Box component={RouterLink} to="/" sx={{ display: "inline-flex" }}>
            <Logo />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.to === "/"}
                sx={navLinkSx}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Stack
            direction="row"
            spacing={1.25}
            sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}
          >
            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to={accountPath}
                  variant="contained"
                  startIcon={<DashboardRoundedIcon />}
                >
                  Contul meu
                </Button>
                <Button
                  variant="text"
                  sx={{ color: "text.primary" }}
                  onClick={logout}
                >
                  Ieși
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/autentificare"
                  variant="text"
                  sx={{ color: "text.primary" }}
                >
                  Autentificare
                </Button>
                <Button
                  component={RouterLink}
                  to="/inregistrare"
                  variant="contained"
                  startIcon={<StorefrontRoundedIcon />}
                >
                  Adaugă afacerea
                </Button>
              </>
            )}
          </Stack>

          <IconButton
            edge="end"
            aria-label="Deschide meniul"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: { sx: { width: 300, bgcolor: "background.default" } },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo size="small" />
          <IconButton
            aria-label="Închide meniul"
            onClick={() => setOpen(false)}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1, py: 1.5 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.active": {
                  color: "primary.main",
                  bgcolor: "rgba(140,47,57,0.08)",
                },
              }}
            >
              <ListItemText
                slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                primary={item.label}
              />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: "auto", p: 2, display: "grid", gap: 1.25 }}>
          {user ? (
            <>
              <Button
                component={RouterLink}
                to={accountPath}
                variant="contained"
                fullWidth
                startIcon={<DashboardRoundedIcon />}
                onClick={() => setOpen(false)}
              >
                Contul meu
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Ieși din cont
              </Button>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/autentificare"
                variant="outlined"
                fullWidth
                onClick={() => setOpen(false)}
              >
                Autentificare
              </Button>
              <Button
                component={RouterLink}
                to="/inregistrare"
                variant="contained"
                fullWidth
                startIcon={<StorefrontRoundedIcon />}
                onClick={() => setOpen(false)}
              >
                Adaugă afacerea
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
