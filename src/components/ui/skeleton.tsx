import * as React from "react";
import { Skeleton as MuiSkeleton } from "@mui/material";

function Skeleton({ className, sx, ...props }: React.ComponentProps<typeof MuiSkeleton>) {
  return (
    <MuiSkeleton
      sx={{
        bgcolor: "action.hover",
        borderRadius: 1,
        ...sx,
      }}
      {...props}
    />
  );
}

export { Skeleton };
