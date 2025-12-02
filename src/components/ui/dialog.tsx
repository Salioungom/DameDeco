import * as React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/* -------------------------------------------------------------------------- */
/* Context to share open state between Dialog and its sub‑components            */
/* -------------------------------------------------------------------------- */
interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const DialogContext = React.createContext<DialogContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Root component – mirrors Radix.Dialog.Root                                    */
/* -------------------------------------------------------------------------- */
export interface DialogProps extends React.ComponentProps<typeof MuiDialog> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function Dialog({ open: controlledOpen, onOpenChange, children, ...props }: DialogProps) {
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
    props.onClose?.(_event as any, reason);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <MuiDialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            p: 1,
          },
        }}
        {...props}
      >
        {children}
      </MuiDialog>
    </DialogContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger – button that toggles the dialog                                      */
/* -------------------------------------------------------------------------- */
function DialogTrigger({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    console.warn("DialogTrigger must be used within Dialog");
    return null;
  }
  const handleClick = (e: React.MouseEvent) => {
    ctx.setOpen(!ctx.open);
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

/* -------------------------------------------------------------------------- */
/* Portal – retained for API compatibility (no‑op)                              */
/* -------------------------------------------------------------------------- */
function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* -------------------------------------------------------------------------- */
/* Overlay – optional custom backdrop (not required with MUI)                    */
/* -------------------------------------------------------------------------- */
function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return null; // MUI Dialog handles overlay
}

/* -------------------------------------------------------------------------- */
/* Content – wraps children                                                     */
/* -------------------------------------------------------------------------- */
function DialogContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <Box sx={{ position: "relative" }} {...props}>
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Header & Footer                                                              */
/* -------------------------------------------------------------------------- */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        textAlign: { xs: "center", sm: "left" },
        mb: 2,
      }}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
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

/* -------------------------------------------------------------------------- */
/* Title & Description                                                          */
/* -------------------------------------------------------------------------- */
function DialogTitle({ className, children, ...props }: React.ComponentProps<typeof MuiDialogTitle>) {
  return (
    <MuiDialogTitle sx={{ p: 0, fontSize: "1.125rem", fontWeight: 600, lineHeight: "none" }} {...props}>
      {children}
    </MuiDialogTitle>
  );
}

function DialogDescription({ className, children, ...props }: React.ComponentProps<typeof Typography>) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} {...props}>
      {children}
    </Typography>
  );
}

/* -------------------------------------------------------------------------- */
/* Close – MUI IconButton that triggers dialog close                           */
/* -------------------------------------------------------------------------- */
function DialogClose({ className, onClick, ...props }: React.ComponentProps<typeof IconButton>) {
  const ctx = React.useContext(DialogContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    ctx?.setOpen(false);
  };
  return (
    <IconButton
      aria-label="close"
      onClick={handleClick}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: "text.secondary",
      }}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
