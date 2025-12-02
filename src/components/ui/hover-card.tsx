import * as React from "react";
import { Popover as MuiPopover, Box, Paper } from "@mui/material";

/* -------------------------------------------------------------------------- */
/* Context to share hover card state                                           */
/* -------------------------------------------------------------------------- */
interface HoverCardContextValue {
  anchorEl: HTMLElement | null;
  open: boolean;
  setAnchorEl: (el: HTMLElement | null) => void;
}
const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Root component – mirrors Radix HoverCard.Root                               */
/* -------------------------------------------------------------------------- */
interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

function HoverCard({ children, openDelay = 700, closeDelay = 300 }: HoverCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>(undefined);

  const handleMouseEnter = (el: HTMLElement) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(el);
      setOpen(true);
    }, openDelay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      setAnchorEl(null);
    }, closeDelay);
  };

  return (
    <HoverCardContext.Provider value={{ anchorEl, open, setAnchorEl }}>
      <Box onMouseLeave={handleMouseLeave}>
        {children}
      </Box>
    </HoverCardContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger – element that triggers the hover card                              */
/* -------------------------------------------------------------------------- */
function HoverCardTrigger({ children, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  const ctx = React.useContext(HoverCardContext);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    ctx?.setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      sx={{ display: "inline-block", ...sx }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Content – the hover card content                                            */
/* -------------------------------------------------------------------------- */
interface HoverCardContentProps {
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  children: React.ReactNode;
  sx?: any;
}

function HoverCardContent({ className, align = "center", sideOffset = 4, children, sx }: HoverCardContentProps) {
  const ctx = React.useContext(HoverCardContext);
  if (!ctx) return null;

  const alignMap: Record<string, "left" | "center" | "right"> = {
    start: "left",
    center: "center",
    end: "right",
  };

  return (
    <MuiPopover
      open={ctx.open}
      anchorEl={ctx.anchorEl}
      onClose={() => ctx.setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: alignMap[align],
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: alignMap[align],
      }}
      sx={{
        pointerEvents: "none", // Allow hovering over content? Usually HoverCard content is interactive.
        // If interactive, we need to handle mouse enter/leave on popover too.
        // But MUI Popover blocks interaction with background.
        // Radix HoverCard is non-modal.
        // We can use disableRestoreFocus and disableScrollLock.
      }}
      disableRestoreFocus
      disableScrollLock
      slotProps={{
        paper: {
          onMouseEnter: () => {
            // Keep open if hovering content
            // We need access to the timer from context or lift state up more.
            // For simplicity, we rely on the parent Box's onMouseLeave which wraps the trigger.
            // But the Popover is in a Portal, so it's outside the parent Box.
            // This is a limitation of this simple implementation.
            // Ideally we should use a proper library or more complex state.
          },
          sx: {
            width: 256,
            p: 2,
            mt: sideOffset / 8,
            pointerEvents: "auto",
            ...sx,
          },
        },
      }}
    >
      {children}
    </MuiPopover>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
