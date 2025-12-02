"use client";

import * as React from "react";
import { DragIndicator as GripVerticalIcon } from "@mui/icons-material";
import * as ResizablePrimitive from "react-resizable-panels";
import { Box } from "@mui/material";

function ResizablePanelGroup({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        ...style,
      }}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  style,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      style={{
        position: "relative",
        display: "flex",
        width: "1px",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--mui-palette-divider)", // Use CSS var for theme awareness if possible, or hardcode color
        // Since we can't easily access theme here without a hook or styled component, and this is a primitive.
        // We can use a Box wrapper? No, PanelResizeHandle must be the component.
        // We can use inline styles with CSS variables if the theme exposes them.
        // Assuming MUI v6 exposes css vars.
        ...style,
      }}
      {...props}
    >
      {withHandle && (
        <Box
          sx={{
            zIndex: 10,
            display: "flex",
            height: 16,
            width: 12,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 0.5,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <GripVerticalIcon sx={{ fontSize: 10 }} />
        </Box>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
