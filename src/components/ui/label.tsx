import * as React from "react";
import { FormLabel } from "@mui/material";

function Label({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof FormLabel>) {
  return (
    <FormLabel
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontSize: "0.875rem",
        lineHeight: 1,
        fontWeight: 500,
        userSelect: "none",
        "&.Mui-disabled": {
          pointerEvents: "none",
          opacity: 0.5,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export { Label };
