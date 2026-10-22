import { SiteChrome } from "@/components/layout/SiteChrome";

export default function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  return <SiteChrome>{children}</SiteChrome>;
}
