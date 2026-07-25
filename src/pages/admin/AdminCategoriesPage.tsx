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
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { categoryOrder, categoryMeta } from "../../data/categories";
import { categoryList } from "../../data/mockData";

interface CatItem {
  id: string;
  name: string;
  icon: SvgIconComponent;
  color: string;
  count: number;
}

const countBySlug = Object.fromEntries(
  categoryList.map((c) => [c.slug, c.count]),
);

const initialCategories: CatItem[] = categoryOrder.map((slug) => ({
  id: slug,
  name: categoryMeta[slug].label,
  icon: categoryMeta[slug].icon,
  color: categoryMeta[slug].color,
  count: countBySlug[slug] ?? 0,
}));

interface DialogState {
  open: boolean;
  mode: "add" | "edit";
  id: string | null;
  name: string;
}

const closedDialog: DialogState = {
  open: false,
  mode: "add",
  id: null,
  name: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CatItem[]>(initialCategories);
  const [dialog, setDialog] = useState<DialogState>(closedDialog);
  const [toast, setToast] = useState("");

  const openAdd = () =>
    setDialog({ open: true, mode: "add", id: null, name: "" });
  const openEdit = (item: CatItem) =>
    setDialog({ open: true, mode: "edit", id: item.id, name: item.name });
  const closeDialog = () => setDialog(closedDialog);

  const save = () => {
    const name = dialog.name.trim();
    if (!name) return;
    if (dialog.mode === "add") {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          name,
          icon: CategoryRoundedIcon,
          color: "#6B615A",
          count: 0,
        },
      ]);
      setToast(`Categoria „${name}” a fost adăugată.`);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === dialog.id ? { ...c, name } : c)),
      );
      setToast("Categoria a fost actualizată.");
    }
    closeDialog();
  };

  const remove = (item: CatItem) => {
    setCategories((prev) => prev.filter((c) => c.id !== item.id));
    setToast(`Categoria „${item.name}” a fost ștearsă.`);
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

      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialog.mode === "add" ? "Adaugă categorie" : "Editează categoria"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Numele categoriei"
            value={dialog.name}
            onChange={(e) => setDialog((d) => ({ ...d, name: e.target.value }))}
            sx={{ mt: 1 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ color: "text.secondary" }}>
            Anulează
          </Button>
          <Button onClick={save} variant="contained">
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
