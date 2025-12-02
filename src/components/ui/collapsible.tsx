import * as React from "react";
import { Collapse, Box } from "@mui/material";
import { cn } from "./utils";

/* -------------------------------------------------------------------------- */
/* Context to share collapsible state                                          */
/* -------------------------------------------------------------------------- */
interface CollapsibleContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Root component – mirrors Radix Collapsible.Root                             */
/* -------------------------------------------------------------------------- */
interface CollapsibleProps extends React.ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Collapsible({ open: controlledOpen, defaultOpen, onOpenChange, children, ...props }: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <Box data-slot="collapsible" {...props}>
        {children}
      </Box>
    </CollapsibleContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger – button that toggles the collapsible                               */
/* -------------------------------------------------------------------------- */
function CollapsibleTrigger({ children, ...props }: React.ComponentPropsWithoutRef<"button">) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) {
    console.warn("CollapsibleTrigger must be used within Collapsible");
    return null;
  }

  const handleClick = () => ctx.setOpen(!ctx.open);

  return (
    <button type="button" data-slot="collapsible-trigger" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Content – collapsible content area                                          */
/* -------------------------------------------------------------------------- */
function CollapsibleContent({ children, className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) {
    console.warn("CollapsibleContent must be used within Collapsible");
    return null;
  }

  return (
    <Collapse in={ctx.open}>
      <Box data-slot="collapsible-content" className={className} {...props}>
        {children}
      </Box>
    </Collapse>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
