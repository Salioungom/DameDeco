import * as React from "react";
import { Menu, MenuItem, Divider, Box, Typography } from "@mui/material";

/* Context for ContextMenu state */
interface ContextMenuContextValue {
  anchorPosition: { top: number; left: number } | null;
  open: boolean;
  handleContextMenu: (event: React.MouseEvent) => void;
  handleClose: () => void;
}
const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null);

interface ContextMenuProps {
  children: React.ReactNode;
}

function ContextMenu({ children }: ContextMenuProps) {
  const [anchorPosition, setAnchorPosition] = React.useState<{ top: number; left: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
  };

  const handleClose = () => {
    setAnchorPosition(null);
  };

  const open = anchorPosition !== null;

  return (
    <ContextMenuContext.Provider value={{ anchorPosition, open, handleContextMenu, handleClose }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

function ContextMenuTrigger({ children, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  const ctx = React.useContext(ContextMenuContext);
  return (
    <Box
      onContextMenu={ctx?.handleContextMenu}
      sx={{ ...sx }}
      {...props}
    >
      {children}
    </Box>
  );
}

function ContextMenuContent({ className, children, sx, ...props }: React.ComponentProps<typeof Menu>) {
  const ctx = React.useContext(ContextMenuContext);
  if (!ctx) return null;

  return (
    <Menu
      open={ctx.open}
      onClose={ctx.handleClose}
      anchorReference="anchorPosition"
      anchorPosition={ctx.anchorPosition || undefined}
      sx={{
        "& .MuiPaper-root": {
          minWidth: 160,
          borderRadius: 1,
          boxShadow: 3,
          p: 0.5,
          ...sx,
        },
      }}
      {...props}
    >
      {children}
    </Menu>
  );
}

function ContextMenuItem({ className, sx, ...props }: React.ComponentProps<typeof MenuItem>) {
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

function ContextMenuSeparator({ className, sx, ...props }: React.ComponentProps<typeof Divider>) {
  return <Divider sx={{ my: 0.5, ...sx }} {...props} />;
}

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator };
