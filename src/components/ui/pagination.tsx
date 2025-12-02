import * as React from "react";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MoreHoriz as MoreHorizontalIcon,
} from "@mui/icons-material";
import { Box, List, ListItem, Button, IconButton } from "@mui/material";

function Pagination({ className, sx, ...props }: React.ComponentProps<"nav"> & { sx?: any }) {
  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="pagination"
      sx={{
        mx: "auto",
        display: "flex",
        width: "100%",
        justifyContent: "center",
        ...sx,
      }}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof List>) {
  return (
    <List
      component="ul"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0.5,
        p: 0,
        m: 0,
        listStyle: "none",
        ...sx,
      }}
      {...props}
    />
  );
}

function PaginationItem({ sx, ...props }: React.ComponentProps<typeof ListItem>) {
  return <ListItem component="li" sx={{ width: "auto", p: 0, ...sx }} {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>;

function PaginationLink({
  className,
  isActive,
  size = "medium", // Default to medium which is roughly icon size in MUI if minWidth is handled
  sx,
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "outlined" : "text"}
      size={size}
      sx={{
        minWidth: 36,
        height: 36,
        p: 0,
        borderRadius: 1,
        color: isActive ? "text.primary" : "text.secondary",
        borderColor: isActive ? "divider" : "transparent",
        "&:hover": {
          bgcolor: "action.hover",
          color: "text.primary",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

function PaginationPrevious({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="medium"
      sx={{
        gap: 1,
        px: 2.5,
        width: "auto",
        ...sx,
      }}
      {...props}
    >
      <ChevronLeftIcon fontSize="small" />
      <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
        Previous
      </Box>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="medium"
      sx={{
        gap: 1,
        px: 2.5,
        width: "auto",
        ...sx,
      }}
      {...props}
    >
      <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
        Next
      </Box>
      <ChevronRightIcon fontSize="small" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  sx,
  ...props
}: React.ComponentProps<"span"> & { sx?: any }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "flex",
        height: 36,
        width: 36,
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...props}
    >
      <MoreHorizontalIcon sx={{ fontSize: 16 }} />
      <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", p: 0, m: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
        More pages
      </Box>
    </Box>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
