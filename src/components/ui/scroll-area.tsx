import * as React from "react";
import { Box } from "@mui/material";

interface ScrollAreaProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  sx?: any;
}

function ScrollArea({ className, children, sx, ...props }: ScrollAreaProps) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "10px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
          borderLeft: "1px solid transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "var(--mui-palette-divider)",
          borderRadius: "9999px",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

interface ScrollBarProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
}

function ScrollBar({ className, orientation = "vertical" }: ScrollBarProps) {
  // MUI Box handles scrollbars via CSS, so this is mainly for API compatibility
  return null;
}

export { ScrollArea, ScrollBar };
