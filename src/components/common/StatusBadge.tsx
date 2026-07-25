import Chip from "@mui/material/Chip";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import type { BusinessStatus } from "../../types";

interface StatusConfig {
  label: string;
  fg: string;
  bg: string;
}

const config: Record<BusinessStatus, StatusConfig> = {
  Active: { label: "Aprobat", fg: "#2C5C41", bg: "#E4F0EA" },
  Pending: { label: "În așteptare", fg: "#8A5A12", bg: "#F7ECDD" },
  Suspended: { label: "Suspendat", fg: "#6B615A", bg: "#ECE7E1" },
  Rejected: { label: "Respins", fg: "#8A2A2A", bg: "#F6E3E3" },
};

const icons: Record<BusinessStatus, typeof CheckCircleRoundedIcon> = {
  Active: CheckCircleRoundedIcon,
  Pending: HourglassTopRoundedIcon,
  Suspended: BlockRoundedIcon,
  Rejected: CancelRoundedIcon,
};

interface StatusBadgeProps {
  status: BusinessStatus;
  size?: "small" | "medium";
}

export default function StatusBadge({
  status,
  size = "small",
}: StatusBadgeProps) {
  const c = config[status];
  const Icon = icons[status];
  return (
    <Chip
      size={size}
      icon={<Icon />}
      label={c.label}
      sx={{
        fontWeight: 700,
        color: c.fg,
        bgcolor: c.bg,
        "& .MuiChip-icon": { color: c.fg, fontSize: "1.05rem" },
      }}
    />
  );
}
