"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          backgroundColor: "var(--mui-palette-background-paper)",
          color: "var(--mui-palette-text-primary)",
          border: "1px solid var(--mui-palette-divider)",
        },
        success: {
          style: {
            backgroundColor: '#F0FDF4',
            color: '#16A34A',
            border: '1px solid #BBF7D0',
          },
          classNames: {
            toast: '!bg-[#F0FDF4] !text-[#16A34A] !border-[#BBF7D0]',
          },
        },
        error: {
          style: {
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
          },
          classNames: {
            toast: '!bg-[#FEF2F2] !text-[#DC2626] !border-[#FECACA]',
          },
        },
        warning: {
          style: {
            backgroundColor: '#FFFBEB',
            color: '#D97706',
            border: '1px solid #FDE68A',
          },
          classNames: {
            toast: '!bg-[#FFFBEB] !text-[#D97706] !border-[#FDE68A]',
          },
        },
        info: {
          style: {
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            border: '1px solid #BFDBFE',
          },
          classNames: {
            toast: '!bg-[#EFF6FF] !text-[#2563EB] !border-[#BFDBFE]',
          },
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
