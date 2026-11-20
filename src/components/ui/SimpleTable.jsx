import { useRef } from "react";
import { useReveal } from "../motion/useReveal";
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { errorMessage } from "../../api/helpers";
import { EmptyState } from "../illustrations/EmptyState";
import { monoFont } from "../../theme/fonts";

/**
 * Data table.
 * columns: [{ key, header, render?(row), mono? }]  (mono = monospace, for IDs/codes)
 * paging (optional): { page (1-based), pageSize, totalItems, onChange({ page, pageSize }) }
 */
export function SimpleTable({
  columns,
  rows = [],
  rowKey = "id",
  isLoading,
  error,
  illustration = "search",
  emptyTitle = "Nothing here yet",
  emptyText,
  paging,
}) {
  const ref = useRef(null);
  useReveal(ref, "tbody tr", { y: 10, stagger: 0.035, duration: 0.4, dependencies: [isLoading, rows.length] });

  if (error) {
    const denied = error?.response?.status === 403;
    return (
      <Paper variant="outlined" sx={{ borderRadius: "18px" }}>
        <EmptyState
          illustration={denied ? "lock" : "error"}
          title={denied ? "You don't have access to this" : "Couldn't load this data"}
          text={denied ? "Your role doesn't include permission to view it. Ask an administrator if you need access." : errorMessage(error)}
        />
      </Paper>
    );
  }

  return (
    <Paper ref={ref} variant="outlined" sx={{ overflow: "hidden", borderRadius: "18px", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.04)" }}>
      <TableContainer>
        <Table size="medium" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.key}>{c.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((c, j) => (
                    <TableCell key={c.key}>
                      <Skeleton animation="wave" height={22} width={c.header ? `${55 + ((i * 7 + j * 13) % 40)}%` : 70} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? null : (
              rows.map((row, i) => (
                <TableRow key={row[rowKey] ?? i} hover>
                  {columns.map((c) => (
                    <TableCell key={c.key} sx={c.mono ? { fontFamily: monoFont, fontSize: "0.8125rem" } : undefined}>
                      {c.render ? c.render(row) : (row[c.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!isLoading && rows.length === 0 && (
        <EmptyState illustration={illustration} title={emptyTitle} text={emptyText} />
      )}
      {paging && paging.totalItems > 0 && (
        <TablePagination
          component="div"
          count={paging.totalItems}
          page={Math.max(0, paging.page - 1)}
          rowsPerPage={paging.pageSize}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={(_, p) => paging.onChange({ page: p + 1, pageSize: paging.pageSize })}
          onRowsPerPageChange={(e) => paging.onChange({ page: 1, pageSize: Number(e.target.value) })}
        />
      )}
    </Paper>
  );
}
