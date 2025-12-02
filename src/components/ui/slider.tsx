import * as React from "react";
import { Slider as MuiSlider } from "@mui/material";

const Slider = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof MuiSlider>>(({ className, sx, ...props }, ref) => (
  <MuiSlider
    ref={ref}
    sx={{
      width: "100%",
      ...sx,
    }}
    {...props}
  />
));
Slider.displayName = "Slider";

export { Slider };
