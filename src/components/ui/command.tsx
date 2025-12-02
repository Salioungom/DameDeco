"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search as SearchIcon } from "@mui/icons-material";
import { Box, Dialog, DialogContent, InputBase, List, ListItem, Typography } from "@mui/material";

function Command({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof CommandPrimitive> & { sx?: any }) {
  return (
    <Box
      component={CommandPrimitive}
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 1,
        bgcolor: "popover.paper",
        color: "popover.foreground",
        ...sx,
      }}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) {
  return (
    <Dialog
      {...props}
      PaperProps={{
        sx: {
          overflow: "hidden",
          p: 0,
          bgcolor: "background.paper",
        }
      }}
    >
      <Command
        sx={{
          "& [cmdk-group-heading]": {
            px: 2,
            fontWeight: 500,
            color: "text.secondary",
          },
          "& [cmdk-group]:not([hidden]) ~ [cmdk-group]": {
            pt: 0,
          },
          "& [cmdk-item]": {
            px: 2,
            py: 1.5,
            cursor: "default",
          },
          "& [cmdk-item][data-selected='true']": {
            bgcolor: "action.hover",
            color: "text.primary",
          },
          "& [cmdk-item] svg": {
            width: 20,
            height: 20,
          },
        }}
      >
        {children}
      </Command>
    </Dialog>
  );
}

function CommandInput({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & { sx?: any }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: 1,
        borderColor: "divider",
        px: 1.5,
      }}
      data-slot="command-input-wrapper"
    >
      <SearchIcon sx={{ mr: 1, color: "text.disabled", fontSize: 20 }} />
      <Box
        component={CommandPrimitive.Input}
        sx={{
          flex: 1,
          height: 44,
          width: "100%",
          borderRadius: 0,
          bgcolor: "transparent",
          py: 1.5,
          fontSize: "0.875rem",
          outline: "none",
          border: "none",
          color: "text.primary",
          "&::placeholder": {
            color: "text.disabled",
          },
          "&:disabled": {
            cursor: "not-allowed",
            opacity: 0.5,
          },
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
}

function CommandList({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List> & { sx?: any }) {
  return (
    <Box
      component={CommandPrimitive.List}
      sx={{
        maxHeight: 300,
        overflowY: "auto",
        overflowX: "hidden",
        ...sx,
      }}
      {...props}
    />
  );
}

function CommandEmpty({
  sx,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty> & { sx?: any }) {
  return (
    <Box
      component={CommandPrimitive.Empty}
      sx={{
        py: 3,
        textAlign: "center",
        fontSize: "0.875rem",
        ...sx,
      }}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group> & { sx?: any }) {
  return (
    <Box
      component={CommandPrimitive.Group}
      sx={{
        overflow: "hidden",
        p: 0.5,
        color: "text.primary",
        "& [cmdk-group-heading]": {
          px: 1,
          py: 0.75,
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "text.secondary",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator> & { sx?: any }) {
  return (
    <Box
      component={CommandPrimitive.Separator}
      sx={{
        height: "1px",
        mx: -0.5,
        bgcolor: "divider",
        ...sx,
      }}
      {...props}
    />
  );
}

function CommandItem({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> & { sx?: any }) {
  return (
    <Box
      component={CommandPrimitive.Item}
      sx={{
        position: "relative",
        display: "flex",
        cursor: "default",
        select: "none",
        alignItems: "center",
        borderRadius: 0.5,
        px: 1,
        py: 0.75,
        fontSize: "0.875rem",
        outline: "none",
        "&[data-disabled='true']": {
          pointerEvents: "none",
          opacity: 0.5,
        },
        "&[data-selected='true']": {
          bgcolor: "action.hover",
          color: "text.primary",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  sx,
  ...props
}: React.ComponentProps<"span"> & { sx?: any }) {
  return (
    <Typography
      component="span"
      variant="caption"
      sx={{
        ml: "auto",
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        color: "text.secondary",
        ...sx,
      }}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
