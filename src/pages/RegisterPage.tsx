import { useState } from "react";
import type { FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../auth/authContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register({ firstName, lastName, email, password });
      navigate("/cont/afacere-noua", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Înregistrare eșuată.");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Creează-ți contul"
      subtitle="Adaugă-ți afacerea pe harta Vrancei în câțiva pași."
      footer={
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Ai deja cont?{" "}
          <Link
            component={RouterLink}
            to="/autentificare"
            sx={{ fontWeight: 700 }}
          >
            Autentifică-te
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
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Prenume"
              required
              fullWidth
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Nume"
              required
              fullWidth
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>
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
            autoComplete="new-password"
            helperText="Minim 8 caractere, cu litere și cifre."
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
          <FormControlLabel
            control={<Checkbox required size="small" />}
            label={
              <Typography variant="body2">
                Sunt de acord cu{" "}
                <Link href="#" sx={{ fontWeight: 600 }}>
                  Termenii
                </Link>{" "}
                și{" "}
                <Link href="#" sx={{ fontWeight: 600 }}>
                  Politica de confidențialitate
                </Link>
                .
              </Typography>
            }
          />
          <Button
            type="submit"
            size="large"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Se creează contul…" : "Creează cont"}
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
