import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export type InputProps = React.ComponentProps<typeof TextField>;

const Input = React.forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  return (
    <TextField
      ref={ref}
      variant="outlined"
      fullWidth
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 1,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
