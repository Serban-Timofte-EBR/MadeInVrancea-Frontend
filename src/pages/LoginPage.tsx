import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Google from "@mui/icons-material/Google";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import Alert from "@mui/material/Alert";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../auth/authContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname;

  useEffect(() => {
    if (user) {
      navigate(from ?? (user.role === "Admin" ? "/admin" : "/cont"), {
        replace: true,
      });
    }
  }, [user, from, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Autentificare eșuată.");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Bine ai revenit"
      subtitle="Autentifică-te pentru a-ți administra afacerea."
      footer={
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Nu ai cont?{" "}
          <Link
            component={RouterLink}
            to="/inregistrare"
            sx={{ fontWeight: 700 }}
          >
            Înregistrează-te
          </Link>
        </Typography>
      }
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.25}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Parolă"
            type={showPw ? "text" : "password"}
            required
            fullWidth
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw((s) => !s)}
                      edge="end"
                      aria-label="Arată parola"
                    >
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked size="small" />}
              label="Ține-mă minte"
            />
            <Link href="#" variant="body2" sx={{ fontWeight: 600 }}>
              Ai uitat parola?
            </Link>
          </Stack>
          <Button
            type="submit"
            size="large"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Se conectează…" : "Autentifică-te"}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3, color: "text.secondary", fontSize: "0.85rem" }}>
        sau
      </Divider>

      <Stack spacing={1.5}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Google />}
          sx={{ color: "text.primary", borderColor: "divider" }}
        >
          Continuă cu Google
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<FacebookRoundedIcon />}
          sx={{ color: "text.primary", borderColor: "divider" }}
        >
          Continuă cu Facebook
        </Button>
      </Stack>
    </AuthLayout>
  );
}
