"use client";

import { LayoutDashboard, FileText, PlusCircle, Users, Home, LogOut, Mail, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';

export default function AdminMobileNav() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FileText, label: 'Posts', href: '/admin/posts' },
    { icon: Mail, label: 'Letters', href: '/admin/letters' },
    { icon: PlusCircle, label: 'New', isCreateMenu: true },
    { icon: Home, label: 'Site', href: '/' },
    { 
      icon: LogOut, 
      label: 'Logout',
      onClick: () => signOut({ callbackUrl: '/admin/login' })
    }
  ];

  const pathname = usePathname();
  
  // Don't show on login page or non-admin pages
  if (pathname === '/admin/login' || !pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Create Menu Modal */}
      {showCreateMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:hidden"
          onClick={() => setShowCreateMenu(false)}
        >
          <div 
            className="bg-white w-full rounded-t-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New</h3>
              <button 
                onClick={() => setShowCreateMenu(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <Link
              href="/admin/create/new"
              onClick={() => setShowCreateMenu(false)}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Post</p>
                <p className="text-sm text-gray-500">Create a new blog post</p>
              </div>
            </Link>
            
            <Link
              href="/admin/letters/create"
              onClick={() => setShowCreateMenu(false)}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Letter</p>
                <p className="text-sm text-gray-500">Create a new letter</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
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

            // Handle create menu button
            if (item.isCreateMenu) {
              return (
                <div key={index}>
                  <button
                    onClick={() => setShowCreateMenu(true)}
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
    </>
  );
}
