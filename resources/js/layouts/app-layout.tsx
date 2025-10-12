import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import type { BreadcrumbItem, InertiaFlash } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { props: pageProps } = usePage();
  const flash = (pageProps as any).flash as InertiaFlash | undefined;

  // Show toast when Laravel flashes messages
  useEffect(() => {
    if (!flash) return;
    if (flash.status)  toast.success(flash.status);
    if (flash.success) toast.success(flash.success);
    if (flash.info)    toast(flash.info);
    if (flash.warning) toast.warning(flash.warning);
    if (flash.error)   toast.error(flash.error);
  }, [flash?.status, flash?.success, flash?.info, flash?.warning, flash?.error]);

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      {/* Mount once at the root layout */}
      <Toaster position="top-center" />
    </AppLayoutTemplate>
  );
}
