"use client";
import { HomeIcon, UserCircle2Icon, FileText, Instagram, Youtube, Mail } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileNav() {
    const navItems = [
    { icon: HomeIcon, label: 'Home', href: '/', isExternal: false },
    { icon: UserCircle2Icon, label: 'About', href: '/about', isExternal: false },
    { icon: FileText, label: 'Letters', href: '/letters', isExternal: false },
    { icon: FiGithub, label: 'GitHub', href: 'https://github.com/chijex5', isExternal: true },
    { icon: BsTwitterX, label: 'Twitter', href: 'https://x.com/chijex5', isExternal: true },
    { icon: Mail, label: 'Email', href: 'mailto:chijioke@uzodinma.tech', isExternal: true }
  ];
    const pathname = usePathname();
    if (pathname.startsWith('/admin')) {
      return null;
    }
    return (
        <nav 
        className="fixed sm:hidden bottom-0 left-0 right-0 bg-[var(--color-warm-accent)] border-t border-gray-200"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="grid grid-cols-6 gap-1 px-2 py-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isMailLink = item.href.startsWith("mailto:");
            const isExternalWeb = item.isExternal && !isMailLink;
            return (
              <div key={index}>
                {item.isExternal ? (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(isExternalWeb && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="flex flex-col items-center justify-center text-black hover:text-gray-900 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center py-2">
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[0.6rem] font-medium">
                        {item.label}
                      </span>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex flex-col items-center justify-center text-black hover:text-gray-900 transition-colors"
                  >
                    <div
                      className={`flex flex-col items-center justify-center ${
                        pathname === item.href
                          ? "bg-white p-1 px-2 rounded-lg"
                          : "py-2"
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[0.6rem] font-medium">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    )
}