import * as React from "react";
import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { cn } from "./utils";

/* Simplified Form implementation using MUI FormControl */
function Form({ children, ...props }: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form data-slot="form" {...props}>
      {children}
    </form>
  );
}

function FormItem({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="form-item"
      className={cn("space-y-2", className)}
      {...props}
    />
  );
}

function CustomFormLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof FormLabel>) {
  return (
    <FormLabel
      data-slot="form-label"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

function CustomFormControl({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="form-control" className={className} {...props} />;
}

function SidebarMenuButton({ className, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      data-slot="sidebar-menu-button"
      className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent w-full text-left", className)}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FormMessage({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof FormHelperText>) {
  return (
    <FormHelperText
      data-slot="form-message"
      error
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </FormHelperText>
  );
}

function FormField({ children }: { children: React.ReactNode }) {
  return <div data-slot="form-field">{children}</div>;
}

export {
  Form,
  FormItem,
  CustomFormLabel as FormLabel,
  CustomFormControl as FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
