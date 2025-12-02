import * as React from "react";
import { Box } from "@mui/material";

interface AspectRatioProps extends React.ComponentProps<"div"> {
  ratio?: number;
  sx?: any;
}

function AspectRatio({ ratio = 1, children, sx, ...props }: AspectRatioProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingBottom: `${100 / ratio}%`,
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export { AspectRatio };
