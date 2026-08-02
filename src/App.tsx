import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const DirectoryPage = lazy(() => import("./pages/DirectoryPage"));
const BusinessProfilePage = lazy(() => import("./pages/BusinessProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DashboardHomePage = lazy(
  () => import("./pages/dashboard/DashboardHomePage"),
);
const OnboardingPage = lazy(() => import("./pages/dashboard/OnboardingPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminCategoriesPage = lazy(
  () => import("./pages/admin/AdminCategoriesPage"),
);

function PageLoader() {
  return (
    <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <CircularProgress color="primary" />
    </Box>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/harta" element={<MapPage />} />
          <Route path="/director" element={<DirectoryPage />} />
          <Route path="/afaceri/:slug" element={<BusinessProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/autentificare" element={<LoginPage />} />
        <Route path="/inregistrare" element={<RegisterPage />} />

        <Route element={<ProtectedRoute roles={["BusinessOwner", "Admin"]} />}>
          <Route path="/cont" element={<DashboardLayout variant="merchant" />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="afacere-noua" element={<OnboardingPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["Admin"]} />}>
          <Route path="/admin" element={<DashboardLayout variant="admin" />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="utilizatori" element={<AdminUsersPage />} />
            <Route path="categorii" element={<AdminCategoriesPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
