import * as React from "react";
import { Button as MuiButton } from "@mui/material";

const variantMap = {
  default: { color: "primary", variant: "contained" },
  destructive: { color: "error", variant: "contained" },
  outline: { color: "inherit", variant: "outlined" },
  secondary: { color: "secondary", variant: "contained" },
  ghost: { color: "inherit", variant: "text" },
  link: { color: "primary", variant: "text" },
} as const;

const sizeMap = {
  default: "medium",
  sm: "small",
  lg: "large",
  icon: "small",
} as const;

export interface ButtonProps extends Omit<React.ComponentProps<typeof MuiButton>, "variant" | "color" | "size"> {
  variant?: keyof typeof variantMap;
  size?: keyof typeof sizeMap;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, sx, ...props }, ref) => {
    const { color, variant: muiVariant } = variantMap[variant as keyof typeof variantMap] ?? variantMap["default"];
    const muiSize = sizeMap[size as keyof typeof sizeMap] ?? sizeMap["default"];

    if (asChild) {
      const Comp = (props as any).as || "span";
      return <Comp ref={ref} {...props} />;
    }

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        color={color}
        size={muiSize}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          ...(size === "icon" && {
            minWidth: "36px",
            width: "36px",
            height: "36px",
            padding: 0,
          }),
          ...sx,
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
