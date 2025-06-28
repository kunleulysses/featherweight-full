import React, { ReactNode } from "react";
import { Header } from "@/components/layout/enhanced-header";
import { Footer } from "@/components/layout/footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}