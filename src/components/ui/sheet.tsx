import * as React from "react";
import { Drawer, IconButton, Box, Typography } from "@mui/material";
import { Close as XIcon } from "@mui/icons-material";

/* Context for Sheet state */
interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const SheetContext = React.createContext<SheetContextValue | null>(null);

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const ctx = React.useContext(SheetContext);
  const handleClick = (e: React.MouseEvent) => {
    ctx?.setOpen(true);
    props.onClick?.(e as any);
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

interface SheetContentProps extends React.ComponentProps<typeof Drawer> {
  side?: "top" | "bottom" | "left" | "right";
}

function SheetContent({ side = "right", className, children, sx, ...props }: SheetContentProps) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) return null;

  return (
    <Drawer
      open={ctx.open}
      onClose={() => ctx.setOpen(false)}
      anchor={side}
      sx={{
        "& .MuiDrawer-paper": {
          width: side === "left" || side === "right" ? 340 : "auto",
          height: side === "top" || side === "bottom" ? 340 : "100%",
          p: 3,
          ...sx,
        },
      }}
      {...props}
    >
      <IconButton
        aria-label="close"
        onClick={() => ctx.setOpen(false)}
        sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}
      >
        <XIcon />
      </IconButton>
      {children}
    </Drawer>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Typography>) {
  return <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof Typography>) {
  return <Typography variant="body2" color="text.secondary" {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "row" },
        justifyContent: { sm: "flex-end" },
        gap: 1,
        mt: 3,
      }}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter };
