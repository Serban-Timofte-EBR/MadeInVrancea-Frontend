import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
  const { pathname } = useLocation();

  // Reset scroll on navigation so pages always open at the top (no jank).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
