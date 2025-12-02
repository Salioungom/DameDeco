import * as React from "react";
import { TextField } from "@mui/material";

export type TextareaProps = React.ComponentProps<typeof TextField>;

const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>((props, ref) => {
  return (
    <TextField
      ref={ref}
      variant="outlined"
      multiline
      minRows={4}
      fullWidth
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
Textarea.displayName = "Textarea";

export { Textarea };
