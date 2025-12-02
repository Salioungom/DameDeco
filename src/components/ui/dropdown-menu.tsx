import * as React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Checkbox,
  Radio,
  Typography,
  Box,
} from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";

/* -------------------------------------------------------------------------- */
/* Context to share menu state between trigger and content                     */
/* -------------------------------------------------------------------------- */
interface DropdownMenuContextValue {
  anchorEl: HTMLElement | null;
  open: boolean;
  setAnchorEl: (el: HTMLElement | null) => void;
}
const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Root component – mirrors Radix DropdownMenu.Root                              */
/* -------------------------------------------------------------------------- */
export type DropdownMenuProps = React.ComponentProps<"div"> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function DropdownMenu({ open: controlledOpen, onOpenChange, children, ...props }: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : Boolean(anchorEl);

  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setAnchorEl(value ? anchorEl : null);
    }
  };

  const handleSetAnchorEl = (el: HTMLElement | null) => {
    if (isControlled) {
      onOpenChange?.(!!el);
    }
    setAnchorEl(el);
  };

  return (
    <DropdownMenuContext.Provider value={{ anchorEl, open, setAnchorEl: handleSetAnchorEl }}>
      <Box {...props}>
        {children}
      </Box>
    </DropdownMenuContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger – button that opens the menu                                         */
/* -------------------------------------------------------------------------- */
function DropdownMenuTrigger({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) return null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    ctx.setAnchorEl(event.currentTarget);
    props.onClick?.(event as any);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Content – renders MUI Menu anchored to the trigger                         */
/* -------------------------------------------------------------------------- */
function DropdownMenuContent({ className, sideOffset = 4, sx, ...props }: React.ComponentProps<typeof Menu> & { sideOffset?: number }) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) return null;

  const handleClose = () => ctx.setAnchorEl(null);

  return (
    <Menu
      anchorEl={ctx.anchorEl}
      open={ctx.open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: 160,
          borderRadius: 1,
          boxShadow: 3,
          p: 0.5,
          mt: sideOffset / 8, // approximate conversion to theme spacing if needed, or just px
          ...sx,
        },
      }}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Item – basic menu item                                                     */
/* -------------------------------------------------------------------------- */
interface DropdownMenuItemProps extends React.ComponentProps<typeof MenuItem> {
  inset?: boolean;
  variant?: "default" | "destructive";
}
function DropdownMenuItem({ inset, variant = "default", className, sx, ...props }: DropdownMenuItemProps) {
  return (
    <MenuItem
      sx={{
        fontSize: "0.875rem",
        borderRadius: 0.5,
        py: 0.75,
        px: 1.5,
        pl: inset ? 4 : 1.5,
        color: variant === "destructive" ? "error.main" : "text.primary",
        "&:hover": {
          bgcolor: variant === "destructive" ? "error.lighter" : "action.hover",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Checkbox Item – menu item with a checkbox                                   */
/* -------------------------------------------------------------------------- */
interface DropdownMenuCheckboxItemProps extends React.ComponentProps<typeof MenuItem> {
  checked?: boolean;
}
function DropdownMenuCheckboxItem({ checked, children, className, sx, ...props }: DropdownMenuCheckboxItemProps) {
  return (
    <MenuItem
      sx={{
        fontSize: "0.875rem",
        borderRadius: 0.5,
        py: 0.75,
        px: 1.5,
        ...sx,
      }}
      {...props}
    >
      <ListItemIcon sx={{ minWidth: 24 }}>
        <Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple size="small" sx={{ p: 0 }} />
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{ fontSize: "0.875rem" }}>{children}</ListItemText>
    </MenuItem>
  );
}

/* -------------------------------------------------------------------------- */
/* Radio Group – wrapper for radio items                                      */
/* -------------------------------------------------------------------------- */
function DropdownMenuRadioGroup({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <Box role="group" {...props}>
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Radio Item – menu item with a radio button                                 */
/* -------------------------------------------------------------------------- */
interface DropdownMenuRadioItemProps extends React.ComponentProps<typeof MenuItem> {
  checked?: boolean;
}
function DropdownMenuRadioItem({ checked, children, className, sx, ...props }: DropdownMenuRadioItemProps) {
  return (
    <MenuItem
      sx={{
        fontSize: "0.875rem",
        borderRadius: 0.5,
        py: 0.75,
        px: 1.5,
        ...sx,
      }}
      {...props}
    >
      <ListItemIcon sx={{ minWidth: 24 }}>
        <Radio edge="start" checked={checked} tabIndex={-1} disableRipple size="small" sx={{ p: 0 }} />
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{ fontSize: "0.875rem" }}>{children}</ListItemText>
    </MenuItem>
  );
}

/* -------------------------------------------------------------------------- */
/* Label – simple text label                                                  */
/* -------------------------------------------------------------------------- */
function DropdownMenuLabel({ inset, className, sx, ...props }: React.ComponentProps<typeof Typography> & { inset?: boolean }) {
  return (
    <Typography
      variant="subtitle2"
      sx={{
        px: 1.5,
        py: 0.75,
        fontSize: "0.875rem",
        fontWeight: 600,
        pl: inset ? 4 : 1.5,
        ...sx,
      }}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Separator – divider line                                                   */
/* -------------------------------------------------------------------------- */
function DropdownMenuSeparator({ className, sx, ...props }: React.ComponentProps<typeof Divider>) {
  return (
    <Divider sx={{ my: 0.5, ...sx }} {...props} />
  );
}

/* -------------------------------------------------------------------------- */
/* Shortcut – right‑aligned shortcut text                                      */
/* -------------------------------------------------------------------------- */
function DropdownMenuShortcut({ className, sx, ...props }: React.ComponentProps<"span"> & { sx?: any }) {
  return (
    <Box
      component="span"
      sx={{
        ml: "auto",
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        color: "text.secondary",
        ...sx,
      }}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Sub – nested menu (simplified)                                            */
/* -------------------------------------------------------------------------- */
function DropdownMenuSub({ children, ...props }: React.ComponentProps<"div">) {
  return <Box {...props}>{children}</Box>;
}

function DropdownMenuSubTrigger({ inset, children, className, sx, ...props }: React.ComponentProps<typeof MenuItem> & { inset?: boolean }) {
  return (
    <MenuItem
      sx={{
        fontSize: "0.875rem",
        borderRadius: 0.5,
        py: 0.75,
        px: 1.5,
        pl: inset ? 4 : 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        ...sx,
      }}
      {...props}
    >
      {children}
      <ChevronRightIcon sx={{ fontSize: 16, ml: 1 }} />
    </MenuItem>
  );
}

function DropdownMenuSubContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof Menu> & { sideOffset?: number }) {
  // Nested menus in MUI usually require a new Menu component anchored to the sub-trigger.
  // This requires state management which is complex to implement fully in a drop-in replacement without context.
  // For now, we'll render it as a Menu but it won't automatically open/close without extra logic.
  // Ideally, DropdownMenuSub should manage this state.
  // Given the constraints, we might need to simplify or accept that nested menus need more work.
  // We'll return null to avoid broken UI, or render it inline?
  // Radix renders it in a portal.
  return null;
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
