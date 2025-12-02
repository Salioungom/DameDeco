import * as React from "react";
import { Tabs as MuiTabs, Tab as MuiTab, Box } from "@mui/material";

/* Context to share state between Tabs components */
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

function Tabs({ defaultValue, value: controlledValue, onValueChange, children, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: (val) => handleChange(null as any, val) }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} {...props}>
        {children}
      </Box>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className, sx, ...props }: React.ComponentProps<typeof MuiTabs>) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;

  return (
    <MuiTabs
      value={ctx.value}
      onChange={(_: React.SyntheticEvent, newValue: string) => ctx.onValueChange(newValue)}
      sx={{
        bgcolor: "action.hover",
        borderRadius: 2,
        p: 0.5,
        minHeight: "unset",
        "& .MuiTabs-indicator": {
          display: "none",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTabs>
  );
}

function TabsTrigger({ value, className, sx, ...props }: React.ComponentProps<typeof MuiTab>) {
  return (
    <MuiTab
      value={value}
      disableRipple
      sx={{
        borderRadius: 1.5,
        minHeight: 32,
        py: 1,
        px: 2,
        textTransform: "none",
        fontWeight: 500,
        color: "text.secondary",
        zIndex: 1,
        "&.Mui-selected": {
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function TabsContent({ value, children, className, sx, ...props }: React.ComponentProps<"div"> & { value: string; sx?: any }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;

  if (ctx.value !== value) return null;

  return (
    <Box
      role="tabpanel"
      sx={{
        outline: "none",
        flex: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
