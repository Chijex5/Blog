"use client";

import { LayoutDashboard, FileText, PlusCircle, Users, Home, LogOut } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';

export default function AdminMobileNav() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', isExternal: false },
    { icon: FileText, label: 'Posts', href: '/admin/posts', isExternal: false },
    { icon: PlusCircle, label: 'New', href: '/admin/create/new', isExternal: false },
    { icon: Users, label: 'Admins', href: '/admin/admins', isExternal: false },
    { icon: Home, label: 'Site', href: '/', isExternal: false },
    { 
      icon: LogOut, 
      label: 'Logout', 
      isExternal: false,
      onClick: () => signOut({ callbackUrl: '/admin/login' })
    }
  ];

  const pathname = usePathname();
  
  // Don't show on login page or non-admin pages
  if (pathname === '/admin/login' || !pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav 
      className="fixed sm:hidden bottom-0 left-0 right-0 bg-[var(--color-warm-accent)] border-t border-gray-200 z-50"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="grid grid-cols-6 gap-1 px-2 py-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          if (item.onClick) {
            return (
              <div key={index}>
                <button
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center text-black hover:text-gray-900 transition-colors w-full"
                >
                  <div className="flex flex-col items-center justify-center py-2">
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[0.6rem] font-medium">
                      {item.label}
                    </span>
                  </div>
                </button>
              </div>
            );
          }

          // Only render Link if item has href
          if (!item.href) {
            return null;
          }

          return (
            <div key={index}>
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center text-black hover:text-gray-900 transition-colors"
              >
                <div
                  className={`flex flex-col items-center justify-center ${
                    isActive
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
            </div>
          );
        })}
      </div>
    </nav>
  );
}
