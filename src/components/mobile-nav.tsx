"use client";
import { HomeIcon, UserCircle2Icon, FileText, Instagram, Youtube, Mail } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileNav() {
    const navItems = [
    { icon: HomeIcon, label: 'Home', href: '/' },
    { icon: UserCircle2Icon, label: 'About', href: '/about' },
    { icon: FileText, label: 'Letters', href: '/letters' },
    { icon: Instagram, label: 'Instagram', href: '/instagram' },
    { icon: Youtube, label: 'YouTube', href: '/youtube' },
    { icon: Mail, label: 'Email', href: '/email' }
  ];
    const pathname = usePathname();
    return (
        <nav 
        className="fixed sm:hidden bottom-0 left-0 right-0 bg-[var(--color-warm-accent)] border-t border-gray-200"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="grid grid-cols-6 gap-1 px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center text-black hover:text-gray-900 transition-colors`}
              >
                <div className={ `flex flex-col items-center justify-center ${pathname === item.href ? 'bg-white p-1 px-2 rounded-lg' : ' py-2'}` }>
                <Icon className="w-5 h-5 mb-1" strokeWidth={1.5} />
                <span className="text-[0.6rem] font-medium">{item.label}</span>
                </div>
              </a>
            );
          })}
        </div>
      </nav>
    )
}