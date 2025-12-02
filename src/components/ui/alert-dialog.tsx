import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

/* -------------------------------------------------------------------------- */
/* Context to share open state between AlertDialog and its sub‑components      */
/* -------------------------------------------------------------------------- */
interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Root component – mirrors Radix.AlertDialog.Root                              */
/* -------------------------------------------------------------------------- */
interface AlertDialogProps extends React.ComponentProps<typeof Dialog> {
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

function AlertDialog({ open: controlledOpen, onOpenChange, children, ...props }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const handleClose = (_event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    setOpen(false);
    props.onClose?.(_event, reason);
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            boxShadow: 24,
            p: 3,
            maxWidth: "sm",
            width: "100%",
          }
        }}
        {...props}
      >
        {children}
      </Dialog>
    </AlertDialogContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger – a simple button that toggles the dialog                           */
/* -------------------------------------------------------------------------- */
function AlertDialogTrigger({ children, ...props }: React.ComponentProps<"button">) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) return null;

  const handleClick = () => ctx.setOpen(!ctx.open);
  return (
    <Box component="button" onClick={handleClick} {...props}>
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Portal – kept for API compatibility (no‑op)                                 */
/* -------------------------------------------------------------------------- */
function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* -------------------------------------------------------------------------- */
/* Overlay – optional custom backdrop (not required with MUI)                   */
/* -------------------------------------------------------------------------- */
function AlertDialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return null;
}

/* -------------------------------------------------------------------------- */
/* Content – wraps MUI DialogContent with original styling & animation         */
/* -------------------------------------------------------------------------- */
function AlertDialogContent({ className, children, sx, ...props }: React.ComponentProps<typeof DialogContent> & { sx?: any }) {
  // In MUI, DialogContent is a child of Dialog.
  // Here we are inside Dialog (children of AlertDialog).
  // We can just render children, or use Box to wrap them if needed.
  // But AlertDialogContent usually contains Header and Footer.
  // So we can just render a Box.
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, ...sx }} {...props}>
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Header & Footer – simple flex containers using Box                         */
/* -------------------------------------------------------------------------- */
function AlertDialogHeader({ className, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        textAlign: { xs: "center", sm: "left" },
        ...sx,
      }}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "row" },
        justifyContent: { sm: "flex-end" },
        gap: 1,
        ...sx,
      }}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Title & Description – map to MUI DialogTitle & DialogContent (as text)    */
/* -------------------------------------------------------------------------- */
function AlertDialogTitle({ className, children, sx, ...props }: React.ComponentProps<typeof DialogTitle> & { sx?: any }) {
  return (
    <DialogTitle
      sx={{
        p: 0,
        fontSize: "1.125rem",
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {children}
    </DialogTitle>
  );
}

function AlertDialogDescription({ className, children, sx, ...props }: React.ComponentProps<typeof Typography> & { sx?: any }) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: "0.875rem",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

/* -------------------------------------------------------------------------- */
/* Action & Cancel – MUI Buttons preserving original variant styling          */
/* -------------------------------------------------------------------------- */
function AlertDialogAction({
  className,
  children,
  onClick,
  disabled,
  type = "button",
  sx,
  ...otherProps
}: React.ComponentProps<typeof Button> & { sx?: any }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      type={type}
      sx={{ ...sx }}
      {...otherProps}
    >
      {children}
    </Button>
  );
}

function AlertDialogCancel({
  className,
  children,
  onClick,
  disabled,
  type = "button",
  sx,
  ...otherProps
}: React.ComponentProps<typeof Button> & { sx?: any }) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      type={type}
      sx={{ ...sx }}
      {...otherProps}
    >
      {children}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Export – keep original names for drop‑in replacement                        */
/* -------------------------------------------------------------------------- */
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
