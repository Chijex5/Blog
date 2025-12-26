"use client"

import React, { createContext, useContext, useState } from "react"
import Image from "next/image"
import {
  Home,
  User,
  Mail,
  Instagram,
  Youtube,
  FileText,
  PinIcon,
  ChevronLeft,
  ChevronRight,
  LucideArrowUpRightSquare,
  ArrowUpRightIcon,
} from "lucide-react"

// Sidebar Context
const SidebarContext = createContext<{
  isCollapsed: boolean
  toggleSidebar: () => void
} | null>(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
  return <div className={`w-full ${isCollapsed ? 'md:ml-[4.5rem]' : 'md:ml-[15rem]'}`}>{children}</div>;
}
// Sidebar Provider
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="flex min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

// Main Sidebar Component
export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={`hidden md:block fixed left-0 top-0 h-screen bg-[var(--color-warm-sidebar)] border-r transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? "w-[4.5rem] px-2" : "w-[15rem]"
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {children}
      </div>
    </aside>
  )
}

// Sidebar Toggle Button
export function SidebarToggle() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className="absolute -right-4 top-12 z-50 h-8 w-8 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors"
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </button>
  )
}

// Sidebar Header
export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-6">
      {children}
    </div>
  )
}

// Sidebar Content
export function SidebarContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className={`flex-1 overflow-auto ${isCollapsed ? "overflow-hidden" : ""}`}>
      {children}
    </div>
  )
}

// Sidebar Footer
export function SidebarFooter({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  
  if (isCollapsed) return null
  
  return (
    <div className="px-4 py-6 border-t">
      {children}
    </div>
  )
}

// Sidebar Group
export function SidebarGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-2 py-2 mb-2 ${className}`}>
      {children}
    </div>
  )
}

// Sidebar Group Label
export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  
  if (isCollapsed) return null
  
  return (
    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase">
      {children}
    </div>
  )
}

// Sidebar Menu Button
export function SidebarMenuButton({
  children,
  isActive = false,
  icon: Icon,
  badge,
}: {
  children: React.ReactNode
  isActive?: boolean
  icon: any
  badge?: string | number
}) {
  const { isCollapsed } = useSidebar()

  return (
    <button
      className={`w-full flex items-center mb-2 gap-4 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-white text-gray-900"
          : "text-gray-700 hover:bg-white/50"
      } ${isCollapsed ? "justify-center w-8 h-8" : ""}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left text-sm">{children}</span>
          {badge && (
            <span className="text-xs bg-gray-200 rounded-md px-2 py-0.5">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  )
}

// Demo App Component
export default function SidebarApp() {
  return (
      <Sidebar>
        <SidebarToggle />
        
        <SidebarHeader>
          <ProfileSection />
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarMenuButton  icon={Home} isActive>
              Home
            </SidebarMenuButton>
            <SidebarMenuButton icon={User}>
              About
            </SidebarMenuButton>
            <SidebarMenuButton icon={FileText} badge={6}>
              Letters
            </SidebarMenuButton>
          </SidebarGroup>

          {/* Find Me Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Find me</SidebarGroupLabel>
            <SidebarMenuButton icon={Instagram}>
              Instagram
            </SidebarMenuButton>
            <SidebarMenuButton icon={Youtube}>
              YouTube
            </SidebarMenuButton>
            <SidebarMenuButton icon={Mail}>
              Email
            </SidebarMenuButton>
          </SidebarGroup>

          {/* Pinned Section */}
          <PinnedSection />
        </SidebarContent>

        <SidebarFooter>
          <NewsletterForm />
        </SidebarFooter>
      </Sidebar>
  )
}

// Profile Section Component
function ProfileSection() {
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0" />
      {!isCollapsed && (
        <div className="leading-tight">
          <p className="font-medium text-sm">Skylar Rowe</p>
          <p className="text-xs text-gray-500">Writer & Digital Creator</p>
        </div>
      )}
    </div>
  )
}

// Pinned Section Component
function PinnedSection() {
  const { isCollapsed } = useSidebar()

  if (isCollapsed) return (
    <SidebarGroup>
      <SidebarMenuButton icon={PinIcon}>Pinned</SidebarMenuButton>
    </SidebarGroup>
  )

  return (
    <SidebarGroup>
        <div className="group bg-white/50 rounded-md flex flex-col p-3 backdrop-blur-sm">
            <p className="text-[10px] font-medium text-gray-500 uppercase px-2 py-1 mb-1">
                Pinned
            </p>

            <img src="https://framerusercontent.com/images/9yiL4fu5UwNTh7C8QpYzPwL8Wo.png" className="w-full h-32 rounded-sm" alt="" />

            <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-[12px] font-medium  text-gray-800 max-w-[60%] leading-snug">
                The Only Writing Tools I Actually Use
                </p>

                <div className="bg-white rounded-sm p-1 w-6 h-6 flex items-center justify-center shrink-0">
                <ArrowUpRightIcon
                    className="w-3.5 h-3.5 text-black transition-transform duration-200 ease-out group-hover:rotate-45"
                />
                </div>
            </div>
         </div>
    </SidebarGroup>
  )
}

// Newsletter Form Component
function NewsletterForm() {
  return (
    <div>
      <p className="font-medium mb-2 text-sm">Stay in the loop</p>
      <input
        type="email"
        placeholder="Your email"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-3"
      />
      <button className="w-full rounded-md bg-black py-2 text-white text-sm hover:bg-gray-800 transition-colors">
        Subscribe
      </button>
    </div>
  )
}