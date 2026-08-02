import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Alert from "@mui/material/Alert";
import { DAY_NAMES_RO } from "../../lib/hours";
import { useAsync } from "../../hooks/useAsync";
import * as businessesApi from "../../api/businesses";
import * as categoriesApi from "../../api/categories";
import * as mediaApi from "../../api/media";
import type { OperatingHourInput } from "../../api/types";
import type { MediaType } from "../../types";
import { useAuth } from "../../auth/authContext";

const steps = ["Date firmă", "Contact & Program", "Poze & Locație"];
const FOCSANI: [number, number] = [45.6966, 27.1863];

const pinIcon = L.divIcon({
  className: "",
  html: '<div class="miv-pin" style="background:#8C2F39"></div>',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

function MapClickHandler({
  onChange,
}: {
  onChange: (p: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function LocationPicker({
  position,
  onChange,
}: {
  position: [number, number];
  onChange: (p: [number, number]) => void;
}) {
  return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker
        position={position}
        icon={pinIcon}
        draggable
        eventHandlers={{
          dragend(e) {
            const ll = e.target.getLatLng();
            onChange([ll.lat, ll.lng]);
          },
        }}
      />
      <MapClickHandler onChange={onChange} />
    </MapContainer>
  );
}

function UploadZone({
  label,
  file,
  mediaType,
  onChange,
}: {
  label: string;
  file: File | null;
  mediaType: MediaType;
  onChange: (file: File) => void;
}) {
  const chooseFile = (files: FileList | null) => {
    const selected = files?.[0];
    if (selected?.type.startsWith("image/")) onChange(selected);
  };

  return (
    <Box
      component="label"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        chooseFile(event.dataTransfer.files);
      }}
      sx={{
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 3,
        p: 3,
        textAlign: "center",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: alpha("#8C2F39", 0.03),
        },
      }}
    >
      <CloudUploadRoundedIcon
        sx={{ fontSize: 34, color: "text.secondary", mb: 1 }}
      />
      <Typography sx={{ fontWeight: 700 }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {file?.name ?? "Trage o imagine aici sau apasă pentru a încărca"}
      </Typography>
      <input
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label={`Încarcă ${label.toLowerCase()}`}
        onChange={(event) => chooseFile(event.target.files)}
        data-media-type={mediaType}
      />
    </Box>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionWarning, setSubmissionWarning] = useState<string | null>(
    null,
  );

  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState<[number, number]>(FOCSANI);
  const [closedDays, setClosedDays] = useState<number[]>([7]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { data: categories } = useAsync(
    (signal) => categoriesApi.list(signal),
    [],
  );

  const toggleClosed = (day: number) =>
    setClosedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const isLast = activeStep === steps.length - 1;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const operatingHours: OperatingHourInput[] = DAY_NAMES_RO.map((_, i) => {
      const dayOfWeek = i + 1;
      const closed = closedDays.includes(dayOfWeek);
      return {
        dayOfWeek,
        openTime: closed ? null : "09:00",
        closeTime: closed ? null : "18:00",
        isClosed: closed,
      };
    });
    try {
      const business = await businessesApi.create({
        name: name.trim(),
        description: description.trim() || undefined,
        taxId: taxId.trim() || undefined,
        contactPhone: phone.trim() || undefined,
        contactEmail: email.trim() || undefined,
        websiteURL: website.trim() || undefined,
        categoryIds: category ? [category] : [],
        location: {
          address: address.trim(),
          city: city.trim(),
          latitude: position[0],
          longitude: position[1],
          isPrimary: true,
          operatingHours,
        },
      });
      const uploads: ReturnType<typeof mediaApi.upload>[] = [];
      if (logoFile) {
        uploads.push(mediaApi.upload(business.businessId, logoFile, "Logo"));
      }
      if (coverFile) {
        uploads.push(mediaApi.upload(business.businessId, coverFile, "Cover"));
      }
      try {
        await Promise.all(uploads);
      } catch (uploadError) {
        setSubmissionWarning(
          uploadError instanceof Error
            ? `Afacerea a fost creată, dar imaginile nu au putut fi încărcate: ${uploadError.message}`
            : "Afacerea a fost creată, dar imaginile nu au putut fi încărcate.",
        );
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trimiterea a eșuat.");
      setActiveStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isLast) {
      void submit();
    } else {
      setActiveStep((s) => s + 1);
    }
  };
  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const coords = useMemo(
    () => `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`,
    [position],
  );

  if (submitted) {
    return (
      <Box
        sx={{
          maxWidth: 560,
          mx: "auto",
          textAlign: "center",
          py: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            width: 84,
            height: 84,
            mx: "auto",
            mb: 3,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "success.main",
            bgcolor: alpha("#3B7A57", 0.12),
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 46 }} />
        </Box>
        <Typography variant="h4" sx={{ mb: 1.5 }}>
          {isAdmin
            ? "Afacerea a fost publicată"
            : "Afacerea a fost trimisă spre aprobare"}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          {isAdmin
            ? "Profilul este activ și vizibil imediat în lista afacerilor și pe hartă."
            : "Echipa Made in Vrancea îți va verifica datele în cel mai scurt timp. Vei primi o notificare imediat ce profilul este aprobat și publicat pe hartă."}
        </Typography>
        {submissionWarning && (
          <Alert severity="warning" sx={{ mb: 3, textAlign: "left" }}>
            {submissionWarning}
          </Alert>
        )}
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(isAdmin ? "/admin" : "/cont")}
        >
          Mergi la panou
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 760, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Adaugă o afacere nouă
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Completează cei 3 pași pentru a-ți publica profilul pe harta Vrancei.
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {activeStep === 0 && (
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              label="Numele afacerii"
              required
              fullWidth
              placeholder="ex. Crama Gîrboiu"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="CUI / CIF"
                fullWidth
                placeholder="ex. RO12345678"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
              />
              <TextField
                select
                label="Categorie principală"
                required
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {(categories ?? []).map((c) => (
                  <MenuItem key={c.categoryId} value={c.categoryId}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Descriere scurtă"
              fullWidth
              multiline
              minRows={4}
              placeholder="Spune-le vizitatorilor ce te face special…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Telefon"
                fullWidth
                placeholder="0237 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                placeholder="contact@afacere.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Website"
                fullWidth
                placeholder="https://"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <TextField
                label="Oraș / Localitate"
                required
                fullWidth
                placeholder="ex. Focșani"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Stack>
            <TextField
              label="Adresă"
              required
              fullWidth
              placeholder="Stradă, număr"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                Program de funcționare
              </Typography>
              <Stack spacing={1}>
                {DAY_NAMES_RO.map((day, i) => {
                  const dayNum = i + 1;
                  const closed = closedDays.includes(dayNum);
                  return (
                    <Stack
                      key={day}
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
                    >
                      <Typography sx={{ width: 92, fontWeight: 600 }}>
                        {day}
                      </Typography>
                      {closed ? (
                        <Typography
                          sx={{
                            flexGrow: 1,
                            color: "text.disabled",
                            fontWeight: 600,
                          }}
                        >
                          Închis
                        </Typography>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: "center", flexGrow: 1 }}
                        >
                          <TextField
                            type="time"
                            size="small"
                            defaultValue="09:00"
                            sx={{ width: 130 }}
                          />
                          <Typography sx={{ color: "text.secondary" }}>
                            –
                          </Typography>
                          <TextField
                            type="time"
                            size="small"
                            defaultValue="18:00"
                            sx={{ width: 130 }}
                          />
                        </Stack>
                      )}
                      <Switch
                        checked={!closed}
                        onChange={() => toggleClosed(dayNum)}
                      />
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <UploadZone
                  label="Logo"
                  file={logoFile}
                  mediaType="Logo"
                  onChange={setLogoFile}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <UploadZone
                  label="Fotografie de copertă"
                  file={coverFile}
                  mediaType="Cover"
                  onChange={setCoverFile}
                />
              </Box>
            </Stack>
            <Divider />
            <Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 1.5 }}
              >
                <PlaceRoundedIcon sx={{ color: "primary.main" }} />
                <Typography sx={{ fontWeight: 700 }}>
                  Plasează afacerea pe hartă
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1.5 }}
              >
                Apasă pe hartă sau trage pin-ul pentru a marca locația exactă.
                Coordonate: <b>{coords}</b>
              </Typography>
              <Box
                sx={{
                  height: 320,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <LocationPicker position={position} onChange={setPosition} />
              </Box>
            </Box>
          </Stack>
        )}

        <Divider sx={{ my: 3 }} />
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ color: "text.secondary" }}
          >
            Înapoi
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={submitting || (isLast && (!name.trim() || !category))}
            endIcon={!isLast ? <ArrowForwardRoundedIcon /> : undefined}
          >
            {isLast
              ? submitting
                ? "Se trimite…"
                : isAdmin
                  ? "Publică afacerea"
                  : "Trimite spre aprobare"
              : "Continuă"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
