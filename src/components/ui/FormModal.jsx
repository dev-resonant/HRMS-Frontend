import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/** Dialog wrapping a <form>; Enter or the primary button submits. */
export function FormModal({
  open,
  title,
  submitText = "Save",
  danger = false,
  isSubmitting = false,
  submitDisabled = false,
  onClose,
  onSubmit,
  children,
  size = "md",
}) {
  const handle = (e) => {
    e?.preventDefault?.();
    onSubmit?.();
  };
  const maxWidth = size === "lg" ? "md" : "sm";
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth fullScreen={fullScreen}>
      <DialogTitle sx={{ fontFamily: '"Plus Jakarta Sans Variable", sans-serif', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent dividers>
        <form id="form-modal" onSubmit={handle} className="hr-form" noValidate>
          {children}
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="form-modal"
          variant="contained"
          color={danger ? "error" : "primary"}
          disabled={isSubmitting || submitDisabled}
        >
          {isSubmitting ? "Working…" : submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
