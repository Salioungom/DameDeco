import * as React from "react";
import { Box, List, ListItem, Link, Paper } from "@mui/material";

/* Simplified NavigationMenu implementation using MUI components */
function NavigationMenu({ className, children, sx, ...props }: React.ComponentProps<"nav"> & { sx?: any }) {
  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

function NavigationMenuList({ className, sx, ...props }: React.ComponentProps<typeof List>) {
  return (
    <List
      component="ul"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0.5,
        p: 0,
        ...sx,
      }}
      {...props}
    />
  );
}

function NavigationMenuItem({ className, sx, ...props }: React.ComponentProps<typeof ListItem>) {
  return (
    <ListItem
      component="li"
      sx={{
        width: "auto",
        p: 0,
        ...sx,
      }}
      {...props}
    />
  );
}

function NavigationMenuTrigger({ className, sx, ...props }: React.ComponentProps<"button"> & { sx?: any }) {
  return (
    <Box
      component="button"
      type="button"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        borderRadius: 1,
        px: 2,
        py: 1,
        fontSize: "0.875rem",
        fontWeight: 500,
        border: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
          bgcolor: "action.hover",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function NavigationMenuContent({ className, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor: "popover.paper",
        p: 2,
        mt: 1,
        ...sx,
      }}
      {...props}
    />
  );
}

function NavigationMenuLink({ className, sx, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      underline="none"
      sx={{
        display: "block",
        userSelect: "none",
        borderRadius: 1,
        p: 1.5,
        lineHeight: 1,
        color: "text.primary",
        "&:hover": {
          bgcolor: "action.hover",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
};
