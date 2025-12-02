import * as React from "react";
import {
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  TableContainer,
  Paper,
} from "@mui/material";

const Table = React.forwardRef<HTMLTableElement, React.ComponentProps<typeof MuiTable>>(({ className, sx, ...props }, ref) => (
  <TableContainer component={Paper} elevation={0} sx={{ width: "100%", overflowX: "auto", border: 1, borderColor: "divider", borderRadius: 1 }}>
    <MuiTable
      ref={ref}
      sx={{
        minWidth: 650,
        "& .MuiTableCell-root": {
          borderBottom: 1,
          borderColor: "divider",
        },
        ...sx,
      }}
      {...props}
    />
  </TableContainer>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.ComponentProps<typeof MuiTableHead>>(({ className, sx, ...props }, ref) => (
  <MuiTableHead ref={ref} sx={{ ...sx }} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentProps<typeof MuiTableBody>>(({ className, sx, ...props }, ref) => (
  <MuiTableBody ref={ref} sx={{ ...sx }} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.ComponentProps<"tfoot">>(({ className, style, ...props }, ref) => (
  <tfoot
    ref={ref}
    style={{
      backgroundColor: "var(--mui-palette-action-hover)",
      borderTop: "1px solid var(--mui-palette-divider)",
      fontWeight: 500,
      ...style,
    }}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentProps<typeof MuiTableRow>>(({ className, sx, ...props }, ref) => (
  <MuiTableRow
    ref={ref}
    sx={{
      "&:hover": {
        bgcolor: "action.hover",
      },
      "&[data-state='selected']": {
        bgcolor: "action.selected",
      },
      ...sx,
    }}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ComponentProps<typeof MuiTableCell>>(({ className, sx, ...props }, ref) => (
  <MuiTableCell
    ref={ref}
    component="th"
    sx={{
      height: 48,
      px: 2,
      textAlign: "left",
      verticalAlign: "middle",
      fontWeight: 500,
      color: "text.secondary",
      "&:has([role=checkbox])": {
        pr: 0,
      },
      ...sx,
    }}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentProps<typeof MuiTableCell>>(({ className, sx, ...props }, ref) => (
  <MuiTableCell
    ref={ref}
    sx={{
      p: 2,
      verticalAlign: "middle",
      "&:has([role=checkbox])": {
        pr: 0,
      },
      ...sx,
    }}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.ComponentProps<"caption">>(({ className, style, ...props }, ref) => (
  <caption
    ref={ref}
    style={{
      marginTop: "1rem",
      fontSize: "0.875rem",
      color: "var(--mui-palette-text-secondary)",
      textAlign: "center",
      ...style,
    }}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
