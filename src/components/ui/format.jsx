/* eslint-disable react-refresh/only-export-components -- small formatting helpers + StatusTag kept together */
import { Chip } from "@mui/material";

export const fmtDate = (v) => (v ? new Date(`${String(v).slice(0, 10)}T00:00:00`).toLocaleDateString() : "—");
export const fmtDateTime = (v) => (v ? new Date(v).toLocaleString() : "—");
export const fmtTime = (v) => (v ? new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—");
/** "09:00:00" -> "09:00" */
export const fmtClock = (v) => (v ? String(v).slice(0, 5) : "—");
export const fmtHours = (v) => (typeof v === "number" ? `${v.toFixed(2)} h` : "—");
export const todayISO = () => new Date().toISOString().slice(0, 10);

// status text (lower-case) -> MUI chip colour
const STATUS_COLOR = {
  active: "success",
  approved: "success",
  present: "success",
  in: "success",
  inactive: "default",
  cancelled: "default",
  "weekly off": "default",
  pending: "info",
  holiday: "info",
  "on leave": "info",
  "half day": "warning",
  late: "warning",
  rejected: "error",
  absent: "error",
  out: "info",
};

/** Colour-coded status pill. */
export function StatusTag({ value }) {
  if (!value) return <>—</>;
  const color = STATUS_COLOR[String(value).toLowerCase()] ?? "default";
  return <Chip size="small" label={value} color={color} variant={color === "default" ? "outlined" : "filled"} />;
}

/** "" -> null so optional fields are cleared rather than sent as empty strings. */
export const emptyToNull = (v) => (v === "" || v === undefined ? null : v);
