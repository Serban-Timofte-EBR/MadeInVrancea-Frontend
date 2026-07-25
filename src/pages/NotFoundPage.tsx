import { Link as RouterLink } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

export default function NotFoundPage() {
  return (
    <Container sx={{ py: { xs: 8, md: 14 }, textAlign: "center" }}>
      <Typography
        sx={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: { xs: "5rem", md: "8rem" },
          lineHeight: 1,
          color: "primary.main",
          mb: 1,
        }}
      >
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 1.5 }}>
        Pagina nu a fost găsită
      </Typography>
      <Typography
        sx={{ color: "text.secondary", maxWidth: 460, mx: "auto", mb: 4 }}
      >
        Se pare că ai ajuns pe un drum nemarcat. Hai să te ducem înapoi pe
        hartă.
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ justifyContent: "center" }}
      >
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeRoundedIcon />}
        >
          Acasă
        </Button>
        <Button
          component={RouterLink}
          to="/harta"
          variant="outlined"
          size="large"
          startIcon={<MapRoundedIcon />}
        >
          Deschide harta
        </Button>
      </Stack>
    </Container>
  );
}
