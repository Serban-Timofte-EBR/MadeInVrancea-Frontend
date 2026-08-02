import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import * as businessesApi from "../../api/businesses";
import * as categoriesApi from "../../api/categories";
import * as locationsApi from "../../api/locations";
import * as mediaApi from "../../api/media";
import type { ApiBusiness, ApiCategory } from "../../api/types";
import { useAsync } from "../../hooks/useAsync";

function EditBusinessForm({
  business,
  categories,
}: {
  business: ApiBusiness;
  categories: ApiCategory[];
}) {
  const navigate = useNavigate();
  const primaryLocation =
    business.locations.find((location) => location.isPrimary) ??
    business.locations[0];
  const [name, setName] = useState(business.name);
  const [taxId, setTaxId] = useState(business.taxId ?? "");
  const [categoryId, setCategoryId] = useState(
    business.categories[0]?.categoryId ?? "",
  );
  const [description, setDescription] = useState(business.description ?? "");
  const [phone, setPhone] = useState(business.contactPhone ?? "");
  const [email, setEmail] = useState(business.contactEmail ?? "");
  const [website, setWebsite] = useState(business.websiteURL ?? "");
  const [city, setCity] = useState(primaryLocation?.city ?? "");
  const [address, setAddress] = useState(primaryLocation?.address ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await businessesApi.update(business.businessId, {
        name: name.trim(),
        taxId: taxId.trim() || null,
        description: description.trim() || null,
        contactPhone: phone.trim() || null,
        contactEmail: email.trim() || null,
        websiteURL: website.trim() || null,
        categoryIds: [categoryId],
      });
      if (primaryLocation) {
        await locationsApi.update(primaryLocation.locationId, {
          address: address.trim(),
          city: city.trim(),
        });
      }
      const uploads: ReturnType<typeof mediaApi.upload>[] = [];
      if (logoFile) {
        uploads.push(mediaApi.upload(business.businessId, logoFile, "Logo"));
      }
      if (coverFile) {
        uploads.push(mediaApi.upload(business.businessId, coverFile, "Cover"));
      }
      await Promise.all(uploads);
      navigate("/cont");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Modificările nu au putut fi salvate.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 820, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate("/cont")}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        Înapoi la cont
      </Button>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Editează afacerea
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Actualizează informațiile afișate în profilul „{business.name}”.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Numele afacerii"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="CUI / CIF"
              fullWidth
              value={taxId}
              onChange={(event) => setTaxId(event.target.value)}
            />
            <TextField
              select
              label="Categorie principală"
              required
              fullWidth
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            label="Descriere"
            multiline
            minRows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Telefon"
              fullWidth
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Stack>
          <TextField
            label="Website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
          {primaryLocation && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Localitate"
                required
                fullWidth
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
              <TextField
                label="Adresă"
                required
                fullWidth
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Stack>
          )}
          <Divider />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadRoundedIcon />}
            >
              {logoFile?.name ?? "Înlocuiește logo-ul"}
              <input
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setLogoFile(event.target.files?.[0] ?? null)
                }
              />
            </Button>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadRoundedIcon />}
            >
              {coverFile?.name ?? "Înlocuiește coperta"}
              <input
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setCoverFile(event.target.files?.[0] ?? null)
                }
              />
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button onClick={() => navigate("/cont")} disabled={saving}>
              Renunță
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              disabled={
                saving ||
                !name.trim() ||
                !categoryId ||
                (Boolean(primaryLocation) && (!city.trim() || !address.trim()))
              }
              onClick={() => void save()}
            >
              {saving ? "Se salvează…" : "Salvează modificările"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default function EditBusinessPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const { data, loading, error } = useAsync(
    async (signal) => {
      if (!businessId) throw new Error("Afacerea nu a fost specificată.");
      const [business, categories] = await Promise.all([
        businessesApi.getOwned(businessId, signal),
        categoriesApi.list(signal),
      ]);
      return { business, categories };
    },
    [businessId],
  );

  if (loading && !data) {
    return (
      <Box sx={{ minHeight: 400, display: "grid", placeItems: "center" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  if (error || !data) return <Alert severity="error">{error}</Alert>;
  return (
    <EditBusinessForm
      key={data.business.businessId}
      business={data.business}
      categories={data.categories}
    />
  );
}
