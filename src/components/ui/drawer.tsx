"use client";

import * as React from "react";
import { Drawer as MuiDrawer, Box, Typography, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// MUI Drawer handles portal, overlay, etc.
// We can map Drawer to MuiDrawer (SwipeableDrawer if needed, but standard Drawer is fine for now).
// However, Radix Drawer (vaul) is usually bottom-up on mobile.
// MuiDrawer supports anchor="bottom".

const DrawerContext = React.createContext<{
  open?: boolean;
  setOpen?: (open: boolean) => void;
} | null>(null);

function Drawer({
  shouldScaleBackground,
  ...props
}: React.ComponentProps<typeof MuiDrawer> & { shouldScaleBackground?: boolean }) {
  // We can't easily replicate vaul's scale background without more complex logic.
  // We'll just use MuiDrawer.
  // But wait, Drawer in Radix is a Root component that doesn't render DOM, just provides context.
  // MuiDrawer IS the drawer.
  // So we need to adapt the API.
  //
  // Radix:
  // <Drawer>
  //   <DrawerTrigger>Open</DrawerTrigger>
  //   <DrawerContent>...</DrawerContent>
  // </Drawer>
  //
  // MUI:
  // <Drawer open={open} onClose={...}>
  //   Content
  // </Drawer>
  //
  // We need a wrapper to manage state if we want to keep the Radix API.

  const [open, setOpen] = React.useState(props.open || false);

  // Sync with props if controlled
  React.useEffect(() => {
    if (props.open !== undefined) {
      setOpen(props.open);
    }
  }, [props.open]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    props.onClose?.({} as any, "backdropClick"); // Mock event
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen: handleOpenChange }}>
      {props.children}
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const ctx = React.useContext(DrawerContext);

  const handleClick = (e: React.MouseEvent) => {
    ctx?.setOpen?.(true);
    props.onClick?.(e as any);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    } as any);
  }

  return (
    <Box component="button" onClick={handleClick} {...props}>
      {children}
    </Box>
  );
}

function DrawerPortal({ ...props }: any) {
  return <>{props.children}</>;
}

function DrawerClose({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const ctx = React.useContext(DrawerContext);

  const handleClick = (e: React.MouseEvent) => {
    ctx?.setOpen?.(false);
    props.onClick?.(e as any);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    } as any);
  }

  return (
    <Box component="button" onClick={handleClick} {...props}>
      {children}
    </Box>
  );
}

function DrawerOverlay({ className, ...props }: any) {
  // MUI Drawer handles overlay.
  return null;
}

function DrawerContent({
  className,
  children,
  sx,
  ...props
}: React.ComponentProps<"div"> & { sx?: any }) {
  const ctx = React.useContext(DrawerContext);

  return (
    <MuiDrawer
      anchor="bottom"
      open={ctx?.open}
      onClose={() => ctx?.setOpen?.(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: "96vh", // Leave some space at top
          ...sx,
        }
      }}
      {...props}
    >
      <Box
        sx={{
          width: 32,
          height: 4,
          bgcolor: "divider",
          borderRadius: 99,
          mx: "auto",
          mt: 2,
          mb: 1,
        }}
      />
      {children}
    </MuiDrawer>
  );
}

function DrawerHeader({ className, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        p: 2,
        textAlign: "center",
        ...sx,
      }}
      {...props}
    />
  );
}

function DrawerFooter({ className, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box
      sx={{
        mt: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        ...sx,
      }}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof Typography> & { sx?: any }) {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        fontWeight: 600,
        lineHeight: 1,
        ...sx,
      }}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof Typography> & { sx?: any }) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: "0.875rem",
        ...sx,
      }}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
