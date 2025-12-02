import * as React from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, Drawer } from "@mui/material";
import { cn } from "./utils";

/* Simplified Sidebar implementation using MUI components */
function Sidebar({ className, children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Box data-slot="sidebar" className={cn("flex h-full flex-col border-r bg-background", className)} {...props}>
      {children}
    </Box>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <Box data-slot="sidebar-header" className={cn("flex items-center gap-2 p-4", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <Box data-slot="sidebar-content" className={cn("flex-1 overflow-auto p-4", className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <Box data-slot="sidebar-footer" className={cn("mt-auto p-4", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <Box data-slot="sidebar-group" className={cn("flex flex-col gap-2", className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <Box data-slot="sidebar-group-label" className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props} />;
}

function SidebarGroupContent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <Box data-slot="sidebar-group-content" className={cn("flex flex-col gap-1", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentPropsWithoutRef<"ul">) {
  return <List data-slot="sidebar-menu" className={cn("flex flex-col gap-1", className)} component="ul" {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentPropsWithoutRef<"li">) {
  return <ListItem data-slot="sidebar-menu-item" className={className} component="li" {...props} />;
}

function SidebarMenuButton({ className, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-button"
      className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent w-full text-left", className)}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};
