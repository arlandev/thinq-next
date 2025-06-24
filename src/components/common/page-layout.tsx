import React from "react";
import Footer from "@/components/common/footer";
import NavBar from "./navbar";

interface PageLayoutProps {
    children: React.ReactNode,
    navbar: React.ReactNode
}

export default function PageLayout ({ children, navbar } : PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {navbar}
      <main className="flex-grow container mx-auto px-6 py-8 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
