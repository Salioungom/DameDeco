import * as React from "react";
import { Popover as MuiPopover, PopoverProps, Box } from "@mui/material";

/* -------------------------------------------------------------------------- */
/* Context to share popover state                                              */
/* -------------------------------------------------------------------------- */
interface PopoverContextValue {
  anchorEl: HTMLElement | null;
  open: boolean;
  setAnchorEl: (el: HTMLElement | null) => void;
}
const PopoverContext = React.createContext<PopoverContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Root component – mirrors Radix Popover.Root                                 */
/* -------------------------------------------------------------------------- */
interface PopoverComponentProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Popover({ open: controlledOpen, onOpenChange, children }: PopoverComponentProps) {
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
    <PopoverContext.Provider value={{ anchorEl, open, setAnchorEl: handleSetAnchorEl }}>
      <Box>{children}</Box>
    </PopoverContext.Provider>
  );
}

/*---------------------------------------------------------------------------*/
/* Trigger – button that opens the popover                                    */
/* -------------------------------------------------------------------------- */
function PopoverTrigger({ children, sx, ...props }: React.ComponentProps<"button"> & { sx?: any }) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) return null;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    ctx.setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={handleClick}
      sx={{
        border: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        p: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Content – the popover content anchored to trigger                          */
/* -------------------------------------------------------------------------- */
interface PopoverContentProps extends Omit<React.ComponentProps<typeof MuiPopover>, "open" | "anchorEl"> {
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

function PopoverContent({ className, align = "center", sideOffset = 4, sx, ...props }: PopoverContentProps) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) return null;

  const handleClose = () => ctx.setAnchorEl(null);

  // Map align values to MUI's horizontal values
  const horizontalAlign = align === "start" ? "left" : align === "end" ? "right" : "center";

  return (
    <MuiPopover
      open={ctx.open}
      anchorEl={ctx.anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: horizontalAlign,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: horizontalAlign,
      }}
      sx={{
        "& .MuiPaper-root": {
          width: 288,
          borderRadius: 1,
          border: 1,
          borderColor: "divider",
          p: 2,
          boxShadow: 3,
          mt: sideOffset / 8,
          ...sx,
        },
      }}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Anchor – optional anchor point (MUI handles this via anchorEl)             */
/* -------------------------------------------------------------------------- */
function PopoverAnchor({ children, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box sx={{ ...sx }} {...props}>
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Export – keep original names for drop‑in replacement                         */
/* -------------------------------------------------------------------------- */
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
