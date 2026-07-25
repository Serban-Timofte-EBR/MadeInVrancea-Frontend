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

const initialUsers: AdminUser[] = [
  {
    id: "u1",
    name: "Maria Popescu",
    email: "maria.popescu@exemplu.ro",
    role: "BusinessOwner",
    status: "Active",
    joined: "2024-02-11",
  },
  {
    id: "u2",
    name: "Andrei Ionescu",
    email: "andrei@madeinvrancea.ro",
    role: "Admin",
    status: "Active",
    joined: "2023-11-02",
  },
  {
    id: "u3",
    name: "Elena Dumitru",
    email: "elena.dumitru@exemplu.ro",
    role: "BusinessOwner",
    status: "Active",
    joined: "2024-03-19",
  },
  {
    id: "u4",
    name: "Vlad Marin",
    email: "vlad.marin@exemplu.ro",
    role: "Customer",
    status: "Active",
    joined: "2024-04-05",
  },
  {
    id: "u5",
    name: "Ioana Radu",
    email: "ioana.radu@exemplu.ro",
    role: "BusinessOwner",
    status: "Suspended",
    joined: "2024-01-28",
  },
  {
    id: "u6",
    name: "George Toma",
    email: "george.toma@exemplu.ro",
    role: "Customer",
    status: "Active",
    joined: "2024-05-14",
  },
];

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
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
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

  const toggleStatus = () => {
    if (!menuUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === menuUser.id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u,
      ),
    );
    setToast(
      menuUser.status === "Active"
        ? `${menuUser.name} a fost suspendat.`
        : `${menuUser.name} a fost reactivat.`,
    );
    closeMenu();
  };

  const deleteUser = () => {
    if (!menuUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== menuUser.id));
    setToast(`${menuUser.name} a fost șters.`);
    closeMenu();
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
                        bgcolor: u.status === "Active" ? "#E4F0EA" : "#ECE7E1",
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
