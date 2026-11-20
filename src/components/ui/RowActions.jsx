import { IconButton, Stack, Tooltip } from "@mui/material";

/**
 * Compact, right-aligned icon actions for a table row.
 * actions: [{ label, icon, onClick, danger?, disabled?, hidden? }] – falsy entries are skipped.
 */
export function RowActions({ actions }) {
  return (
    <Stack direction="row" sx={{ justifyContent: "flex-end", flexWrap: "nowrap", gap: 0.25 }}>
      {actions
        .filter((a) => a && !a.hidden)
        .map((a) => (
          <Tooltip key={a.label} title={a.label} arrow>
            <span>
              <IconButton
                size="small"
                color={a.danger ? "error" : "primary"}
                disabled={a.disabled}
                aria-label={a.label}
                onClick={a.onClick}
              >
                {a.icon}
              </IconButton>
            </span>
          </Tooltip>
        ))}
    </Stack>
  );
}
