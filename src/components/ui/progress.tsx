import * as React from "react";
import { LinearProgress, Box } from "@mui/material";

function Progress({
  className,
  value,
  sx,
  ...props
}: React.ComponentProps<typeof LinearProgress> & { sx?: any }) {
  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        width: "100%",
        borderRadius: 4, // rounded-full
        bgcolor: (theme: any) => `rgba(${theme.palette.primary.mainChannel} / 0.2)`, // bg-primary/20
        "& .MuiLinearProgress-bar": {
          bgcolor: "primary.main",
          borderRadius: 4,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export { Progress };
