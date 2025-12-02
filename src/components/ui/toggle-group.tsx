import * as React from "react";
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from "@mui/material";

interface ToggleGroupProps extends Omit<React.ComponentProps<typeof ToggleButtonGroup>, 'value' | 'onChange'> {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

function ToggleGroup({ type = "single", value, onValueChange, className, children, sx, ...props }: ToggleGroupProps) {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: string | string[]) => {
    onValueChange?.(newValue);
  };

  return (
    <ToggleButtonGroup
      value={value}
      onChange={handleChange}
      exclusive={type === "single"}
      sx={{
        display: "inline-flex",
        borderRadius: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </ToggleButtonGroup>
  );
}

interface ToggleGroupItemProps extends React.ComponentProps<typeof ToggleButton> {
  value: string;
}

function ToggleGroupItem({ className, value, sx, ...props }: ToggleGroupItemProps) {
  return (
    <ToggleButton
      value={value}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        px: 1.5,
        py: 1,
        "&.Mui-selected": {
          bgcolor: "action.selected",
          color: "text.primary",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
