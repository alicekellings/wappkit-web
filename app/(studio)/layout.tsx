import { StudioFooter, StudioHeader } from "@/components/studio/studio-header";

interface StudioLayoutProps {
  children: React.ReactNode;
}

/**
 * studio.wappkit.com 的独立精简布局：
 * 不带主站的 Tools/Blog/Docs 导航，只保留接单相关的入口。
 */
export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <StudioHeader />
      <main className="flex-1">{children}</main>
      <StudioFooter />
    </div>
  );
}
