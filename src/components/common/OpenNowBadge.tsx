import Chip from "@mui/material/Chip";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { OperatingHour } from "../../types";
import { isOpenNow } from "../../lib/hours";

interface OpenNowBadgeProps {
  hours: OperatingHour[];
  size?: "small" | "medium";
}

export default function OpenNowBadge({
  hours,
  size = "small",
}: OpenNowBadgeProps) {
  const open = isOpenNow(hours);
  return (
    <Chip
      size={size}
      icon={<FiberManualRecordIcon sx={{ fontSize: "0.7rem !important" }} />}
      label={open ? "Deschis acum" : "Închis acum"}
      sx={{
        fontWeight: 700,
        bgcolor: open ? "#E4F0EA" : "#F1ECE7",
        color: open ? "#2C5C41" : "#6B615A",
        "& .MuiChip-icon": { color: open ? "#3B7A57" : "#B0A79E" },
      }}
    />
  );
}
