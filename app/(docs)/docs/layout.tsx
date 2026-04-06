import { ScrollArea } from "@/components/ui/scroll-area";
import { DocsSidebarNav } from "@/components/docs/sidebar-nav";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="relative isolate flex-1 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_22%),linear-gradient(to_bottom,#fffdf8,#ffffff_36%,#fffaf2_100%)]" />
      <div className="container max-w-6xl py-6 md:py-8">
        <div className="items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <ScrollArea className="h-full py-6 pr-6 lg:py-8">
              <DocsSidebarNav />
            </ScrollArea>
          </aside>
          {children}
        </div>
      </div>
    </div>
  );
}
