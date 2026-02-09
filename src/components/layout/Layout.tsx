import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BackToTop } from "@/components/ui/BackToTop";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
