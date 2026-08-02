import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha } from "@mui/material/styles";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { useAsync } from "../../hooks/useAsync";
import * as usersApi from "../../api/users";
import type { ApiUser } from "../../api/types";

type Role = "Admin" | "BusinessOwner" | "Customer";
type UserStatus = "Active" | "Suspended";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  joined: string;
}

function normalizeRole(name: string | undefined): Role {
  return name === "Admin" || name === "BusinessOwner" ? name : "Customer";
}

function mapUser(u: ApiUser): AdminUser {
  return {
    id: u.userId,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
    email: u.email,
    role: normalizeRole(u.role?.name),
    status: u.isActive ? "Active" : "Suspended",
    joined: u.createdAt,
  };
}

const roleLabels: Record<Role, string> = {
  Admin: "Administrator",
  BusinessOwner: "Comerciant",
  Customer: "Client",
};

const roleColors: Record<Role, string> = {
  Admin: "#8C2F39",
  BusinessOwner: "#C7853A",
  Customer: "#3A6EA5",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const { data, loading, error, reload } = useAsync(
    (signal) => usersApi.list(signal),
    [],
  );
  const users = useMemo(() => (data ?? []).map(mapUser), [data]);
  const [query, setQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const menuUser = users.find((u) => u.id === menuUserId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, query]);

  const openMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(e.currentTarget);
    setMenuUserId(id);
  };
  const closeMenu = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const toggleStatus = async () => {
    if (!menuUser) return;
    const target = menuUser;
    closeMenu();
    try {
      if (target.status === "Active") {
        await usersApi.suspend(target.id);
      } else {
        await usersApi.activate(target.id);
      }
      setToast(
        target.status === "Active"
          ? `${target.name} a fost suspendat.`
          : `${target.name} a fost reactivat.`,
      );
      reload();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "A apărut o eroare.");
    }
  };

  const deleteUser = async () => {
    if (!menuUser) return;
    const target = menuUser;
    closeMenu();
    try {
      await usersApi.remove(target.id);
      setToast(`${target.name} a fost șters.`);
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
            Utilizatori
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Gestionează conturile și rolurile din platformă.
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Caută utilizator…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
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
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontWeight: 700,
                      color: "text.secondary",
                      bgcolor: alpha("#8C2F39", 0.03),
                    },
                  }}
                >
                  <TableCell>Utilizator</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Înregistrat</TableCell>
                  <TableCell align="right">Acțiuni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(roleColors[u.role], 0.15),
                            color: roleColors[u.role],
                            fontWeight: 700,
                          }}
                        >
                          {u.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {u.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {u.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={roleLabels[u.role]}
                        sx={{
                          fontWeight: 700,
                          color: roleColors[u.role],
                          bgcolor: alpha(roleColors[u.role], 0.12),
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={u.status === "Active" ? "Activ" : "Suspendat"}
                        sx={{
                          fontWeight: 700,
                          color: u.status === "Active" ? "#2C5C41" : "#6B615A",
                          bgcolor:
                            u.status === "Active" ? "#E4F0EA" : "#ECE7E1",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatDate(u.joined)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Acțiuni"
                        onClick={(e) => openMenu(e, u.id)}
                      >
                        <MoreVertRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={toggleStatus}>
          <ListItemIcon>
            {menuUser?.status === "Active" ? (
              <BlockRoundedIcon fontSize="small" />
            ) : (
              <CheckCircleRoundedIcon fontSize="small" />
            )}
          </ListItemIcon>
          {menuUser?.status === "Active" ? "Suspendă" : "Reactivează"}
        </MenuItem>
        <MenuItem onClick={deleteUser} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteOutlineRoundedIcon
              fontSize="small"
              sx={{ color: "error.main" }}
            />
          </ListItemIcon>
          Șterge
        </MenuItem>
      </Menu>

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
