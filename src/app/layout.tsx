import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarWrapper } from "@/components/sidebar";
import SidebarApp from "@/components/sidebar";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({ 
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

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
      <body className={`${inter.variable} ${instrumentSerif.variable} antialiased font-sans`}>
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