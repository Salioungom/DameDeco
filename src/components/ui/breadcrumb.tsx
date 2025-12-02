import * as React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { ChevronRight, MoreHoriz as MoreHorizontal } from "@mui/icons-material";

function Breadcrumb({ className, sx, ...props }: React.ComponentProps<"nav"> & { sx?: any }) {
  return <Box component="nav" aria-label="breadcrumb" sx={{ ...sx }} {...props} />;
}

function BreadcrumbList({ className, children, sx, ...props }: React.ComponentProps<typeof Breadcrumbs>) {
  return (
    <Breadcrumbs
      separator={<ChevronRight sx={{ fontSize: 16 }} />}
      sx={{
        "& .MuiBreadcrumbs-ol": {
          flexWrap: "wrap",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.875rem",
          color: "text.secondary",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Breadcrumbs>
  );
}

function BreadcrumbItem({ className, sx, ...props }: React.ComponentProps<"li"> & { sx?: any }) {
  return (
    <Box
      component="li"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        ...sx,
      }}
      {...props}
    />
  );
}

interface BreadcrumbLinkProps extends React.ComponentProps<typeof Link> {
  asChild?: boolean;
}

function BreadcrumbLink({ asChild, className, sx, ...props }: BreadcrumbLinkProps) {
  return (
    <Link
      underline="hover"
      color="inherit"
      sx={{
        transition: "color 0.2s",
        "&:hover": {
          color: "text.primary",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, sx, ...props }: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      component="span"
      role="link"
      aria-disabled="true"
      aria-current="page"
      sx={{
        fontWeight: "normal",
        color: "text.primary",
        ...sx,
      }}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, sx, ...props }: React.ComponentProps<"li"> & { sx?: any }) {
  return (
    <Box
      component="li"
      role="presentation"
      aria-hidden="true"
      sx={{
        display: "flex",
        alignItems: "center",
        "& > svg": { fontSize: 16 },
        ...sx,
      }}
      {...props}
    >
      {children ?? <ChevronRight />}
    </Box>
  );
}

function BreadcrumbEllipsis({ className, sx, ...props }: React.ComponentProps<"span"> & { sx?: any }) {
  return (
    <Box
      component="span"
      role="presentation"
      aria-hidden="true"
      sx={{
        display: "flex",
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...props}
    >
      <MoreHorizontal sx={{ fontSize: 16 }} />
      <span className="sr-only">More</span>
    </Box>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
