import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types";
import { type SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export function AppSidebarHeader({
  breadcrumbs = [],
}: {
  breadcrumbs?: BreadcrumbItemType[];
}) {
  const { auth } = usePage<SharedData>().props;

  const qty = auth.user?.quantity;
  const credits = typeof qty === "number" ? qty : 0; // ensure it's a number

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Credits:</span>
        <Badge variant="secondary" className="px-2 py-1">
          {credits}
        </Badge>
      </div>
    </header>
  );
}

