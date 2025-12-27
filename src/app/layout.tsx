import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarWrapper } from "@/components/sidebar";
import SidebarApp from "@/components/sidebar";
import Footer from "@/components/Footer";
import { Lora, Source_Serif_4, Manrope } from 'next/font/google'
import MobileNav from "@/components/mobile-nav";
import AuthProvider from "@/components/AuthProvider";

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['200', '300' ,'400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-stylish',
})

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

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
    <html lang="en" className={`${sourceSerif.variable} ${manrope.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <SidebarProvider>
            <SidebarApp />
            <SidebarWrapper>
              <div className="flex-1 w-full bg-[var(--color-warm-bg)] transition-all duration-300">{children}</div>
            </SidebarWrapper>
            <MobileNav />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}