import { useState } from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { getCategoryMeta } from "../../data/categories";
import { useAsync } from "../../hooks/useAsync";
import * as categoriesApi from "../../api/categories";
import * as businessesApi from "../../api/businesses";
import type { ApiCategory } from "../../api/types";

interface CatItem {
  id: string;
  slug: string;
  name: string;
  icon: SvgIconComponent;
  color: string;
  count: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapCategory(c: ApiCategory, count: number): CatItem {
  const meta = getCategoryMeta(c.slug);
  return {
    id: c.categoryId,
    slug: c.slug,
    name: c.name,
    icon: meta.icon,
    color: meta.color,
    count,
  };
}

interface DialogState {
  open: boolean;
  mode: "add" | "edit";
  id: string | null;
  name: string;
  slug: string;
}

const closedDialog: DialogState = {
  open: false,
  mode: "add",
  id: null,
  name: "",
  slug: "",
};

export default function AdminCategoriesPage() {
  const { data, loading, error, reload } = useAsync(async (signal) => {
    const [cats, active] = await Promise.all([
      categoriesApi.list(signal),
      businessesApi.listActive({ limit: 100 }, signal),
    ]);
    const counts: Record<string, number> = {};
    for (const b of active.data) {
      for (const c of b.categories) {
        counts[c.slug] = (counts[c.slug] ?? 0) + 1;
      }
    }
    return cats.map((c) => mapCategory(c, counts[c.slug] ?? 0));
  }, []);

  const categories = data ?? [];

  const [dialog, setDialog] = useState<DialogState>(closedDialog);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const openAdd = () =>
    setDialog({ open: true, mode: "add", id: null, name: "", slug: "" });
  const openEdit = (item: CatItem) =>
    setDialog({
      open: true,
      mode: "edit",
      id: item.id,
      name: item.name,
      slug: item.slug,
    });
  const closeDialog = () => setDialog(closedDialog);

  const save = async () => {
    const name = dialog.name.trim();
    if (!name) return;
    setSaving(true);
    try {
      if (dialog.mode === "add") {
        const slug = dialog.slug.trim() || slugify(name);
        await categoriesApi.create({ name, slug });
        setToast(`Categoria „${name}” a fost adăugată.`);
      } else if (dialog.id) {
        await categoriesApi.update(dialog.id, { name });
        setToast("Categoria a fost actualizată.");
      }
      closeDialog();
      reload();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "A apărut o eroare.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: CatItem) => {
    try {
      await categoriesApi.remove(item.id);
      setToast(`Categoria „${item.name}” a fost ștearsă.`);
      reload();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "A apărut o eroare.");
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Categorii
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Adaugă, editează sau elimină categoriile afișate pe hartă și în
            director.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openAdd}
        >
          Adaugă categorie
        </Button>
      </Stack>

      {loading && !data ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {categories.map((cat) => (
            <Paper
              key={cat.id}
              elevation={0}
              sx={{
                p: 2.25,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  flexShrink: 0,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  color: cat.color,
                  bgcolor: alpha(cat.color, 0.12),
                }}
              >
                <cat.icon />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
                  {cat.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {cat.count} {cat.count === 1 ? "afacere" : "afaceri"}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  size="small"
                  aria-label="Editează"
                  onClick={() => openEdit(cat)}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="Șterge"
                  onClick={() => remove(cat)}
                  sx={{ color: "error.main" }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialog.mode === "add" ? "Adaugă categorie" : "Editează categoria"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="Numele categoriei"
              value={dialog.name}
              onChange={(e) =>
                setDialog((d) => ({ ...d, name: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
              }}
            />
            {dialog.mode === "add" && (
              <TextField
                fullWidth
                label="Slug (opțional)"
                placeholder={slugify(dialog.name) || "ex: crame"}
                value={dialog.slug}
                onChange={(e) =>
                  setDialog((d) => ({ ...d, slug: e.target.value }))
                }
                helperText="Identificatorul din URL. Se generează automat dacă îl lași gol."
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ color: "text.secondary" }}>
            Anulează
          </Button>
          <Button onClick={save} variant="contained" disabled={saving}>
            Salvează
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
