import * as React from "react";
import { Menu, MenuItem, Divider, Box } from "@mui/material";

/* Simple implementation based on MUI Menu to replace Radix Menubar */
function Menubar({ className, children, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 0.5,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

function MenubarMenu({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function MenubarTrigger({ className, sx, ...props }: React.ComponentProps<"button"> & { sx?: any }) {
  return (
    <Box
      component="button"
      type="button"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 0.5,
        px: 1.5,
        py: 0.75,
        fontSize: "0.875rem",
        fontWeight: 500,
        border: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "action.hover",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function MenubarContent({ className, children, sx, ...props }: React.ComponentProps<typeof Menu>) {
  // Note: MenubarContent in Radix is triggered by MenubarTrigger.
  // In this simplified version, we don't have the context to open/close.
  // Real implementation would need a Context similar to DropdownMenu.
  // For now, we'll assume the user handles open/close or we might need to upgrade this later.
  // Returning null as placeholder if not controlled.
  return null;
}

function MenubarItem({ className, sx, ...props }: React.ComponentProps<typeof MenuItem>) {
  return (
    <MenuItem
      sx={{
        fontSize: "0.875rem",
        borderRadius: 0.5,
        py: 0.75,
        px: 1.5,
        "&:hover": {
          bgcolor: "action.hover",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function MenubarSeparator({ className, sx, ...props }: React.ComponentProps<typeof Divider>) {
  return <Divider sx={{ my: 0.5, ...sx }} {...props} />;
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
};
