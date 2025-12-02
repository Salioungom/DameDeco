import * as React from "react";
import { Checkbox as MuiCheckbox, CheckboxProps } from "@mui/material";

const Checkbox = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof MuiCheckbox>>(({ className, sx, ...props }, ref) => {
  return (
    <MuiCheckbox
      ref={ref}
      sx={{
        padding: 0.5,
        "&.Mui-checked": {
          color: "primary.main",
        },
        ...sx,
      }}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
