import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarWrapper } from "@/components/sidebar";
import SidebarApp from "@/components/sidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "My Personal Blog",
  description: "A modern personal blog built with Next.js, TypeScript, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <SidebarProvider>
          <SidebarApp />
          <SidebarWrapper>
            <div className="flex-1 w-full bg-background transition-all duration-300">{children}</div>
          </SidebarWrapper>
        </SidebarProvider>
      </body>
    </html>
  );
}