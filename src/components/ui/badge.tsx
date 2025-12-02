import * as React from "react";
import { Chip, ChipProps } from "@mui/material";

const variantMap = {
  default: { color: "primary", variant: "filled" },
  secondary: { color: "secondary", variant: "filled" },
  destructive: { color: "error", variant: "filled" },
  outline: { color: "default", variant: "outlined" },
} as const;

export interface BadgeProps extends Omit<React.ComponentProps<typeof Chip>, "color" | "variant"> {
  variant?: keyof typeof variantMap;
  asChild?: boolean;
}

function Badge({ variant = "default", className, asChild = false, sx, ...props }: BadgeProps) {
  const { color, variant: chipVariant } = variantMap[variant] ?? variantMap["default"];

  // MUI Chip doesn't support asChild directly. 
  // If asChild is true, we might need to render children directly, but Badge usually implies a visual container.
  // We'll ignore asChild for now as Chip is the intended UI.

  return (
    <Chip
      color={color}
      variant={chipVariant}
      size="small"
      sx={{
        height: "auto",
        padding: "0 4px",
        fontSize: "0.75rem",
        fontWeight: 500,
        lineHeight: 1.5,
        borderRadius: 1,
        "& .MuiChip-label": {
          padding: 0,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export { Badge };
