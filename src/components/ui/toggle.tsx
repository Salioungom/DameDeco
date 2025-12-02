import * as React from "react";
import { ToggleButton } from "@mui/material";

const variantMap = {
  default: "standard",
  outline: "outlined",
} as const;

export interface ToggleProps extends Omit<React.ComponentProps<typeof ToggleButton>, "size" | "variant"> {
  variant?: keyof typeof variantMap;
  size?: "default" | "sm" | "lg";
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(({ className, variant = "default", size = "default", sx, ...props }, ref) => {
  const muiSize = size === "sm" ? "small" : size === "lg" ? "large" : "medium";

  return (
    <ToggleButton
      ref={ref}
      size={muiSize}
      value="toggle" // Default value required by ToggleButton if not part of a group, but usually it is.
      // If used standalone, it needs 'selected' and 'onChange' or 'value'.
      // Assuming this is a standalone toggle button that acts like a checkbox or similar.
      // However, Radix Toggle is a button that toggles state. MUI ToggleButton is usually part of a group.
      // We'll pass props through.
      sx={{
        textTransform: "none",
        fontWeight: 500,
        ...(variant === "outline" && {
          border: 1,
          borderColor: "input.border",
        }),
        ...sx,
      }}
      {...props}
    />
  );
});
Toggle.displayName = "Toggle";

export { Toggle };
