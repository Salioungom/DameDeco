import * as React from "react";
import { Alert as MuiAlert, AlertTitle as MuiAlertTitle, Box } from "@mui/material";

const variantMap = {
  default: "info",
  destructive: "error",
} as const;

type AlertVariant = keyof typeof variantMap;

interface AlertProps extends Omit<React.ComponentProps<typeof MuiAlert>, "severity" | "variant"> {
  variant?: AlertVariant;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "default", ...props }, ref) => {
  const severity = variantMap[variant as AlertVariant] ?? "info";
  return (
    <MuiAlert
      ref={ref}
      severity={severity}
      variant="standard"
      sx={{
        alignItems: "flex-start",
        "& .MuiAlert-icon": {
          mt: "2px",
        },
        ...(variant === "destructive" && {
          borderColor: "error.main",
          color: "error.main",
          "& .MuiAlert-icon": {
            color: "error.main",
          },
        }),
      }}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.ComponentProps<typeof MuiAlertTitle>>((props, ref) => (
  <MuiAlertTitle
    ref={ref}
    sx={{
      mb: 0.5,
      fontWeight: 600,
      lineHeight: 1.5,
    }}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"div">>(({ style, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      fontSize: "0.875rem",
      lineHeight: 1.5,
      opacity: 0.9,
      ...style,
    }}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
