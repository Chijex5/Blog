"use client";

import { LayoutDashboard, FileText, PlusCircle, Users, Home, LogOut, Mail } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';

// Animation constants
const ANIMATION_DURATION = 300;
const SWIPE_THRESHOLD = 100;

export default function AdminMobileNav() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  
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

  // Handle touch gestures for swipe down
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY > 0) {
      currentYRef.current = deltaY;
      
      // Use RAF for smoother animations
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = `translateY(${deltaY}px)`;
        }
      });
    }
  };

  const handleTouchEnd = () => {
    if (currentYRef.current > SWIPE_THRESHOLD) {
      closeSheet();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  const closeSheet = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowCreateMenu(false);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  const openSheet = () => {
    setShowCreateMenu(true);
  };

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (showCreateMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [showCreateMenu]);
  
  // Don't show on login page or non-admin pages
  if (pathname === '/admin/login' || !pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Bottom Sheet Overlay */}
      {showCreateMenu && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 sm:hidden ${
            isAnimating ? 'opacity-0' : 'bg-opacity-30'
          }`}
          style={{ zIndex: 60 }}
          onClick={closeSheet}
        />
      )}

      {/* Bottom Sheet */}
      {showCreateMenu && (
        <div
          ref={sheetRef}
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out sm:hidden ${
            isAnimating ? 'translate-y-full' : 'translate-y-0'
          }`}
          style={{ 
            zIndex: 70,
            maxHeight: '80vh',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)'
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="px-6 pb-6 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Create New</h3>
              <button 
                onClick={closeSheet}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* New Post */}
            <Link
              href="/admin/create/new"
              onClick={closeSheet}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New Post</p>
                <p className="text-sm text-gray-500">Create a new blog post</p>
              </div>
            </Link>
            
            {/* New Letter */}
            <Link
              href="/admin/letters/create"
              onClick={closeSheet}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New Letter</p>
                <p className="text-sm text-gray-500">Create a new letter</p>
              </div>
            </Link>

            {/* New Admin */}
            <Link
              href="/admin/admins"
              onClick={closeSheet}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New Admin</p>
                <p className="text-sm text-gray-500">Add a new administrator</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav 
        className="fixed sm:hidden bottom-0 left-0 right-0 bg-[var(--color-warm-accent)] border-t border-gray-200"
        style={{ 
          zIndex: 50,
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
                    onClick={openSheet}
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
