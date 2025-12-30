'use client';

import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarWrapper,
  SidebarToggle,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  useSidebar
} from '@/components/sidebar';
import AdminMobileNav from '@/components/admin-mobile-nav';
import {
  LayoutDashboard,
  FileText,
  Users,
  PlusCircle,
  LogOut,
  Settings,
  Home,
  Mail
} from 'lucide-react';

function AdminProfileSection() {
  const { isCollapsed } = useSidebar();
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 font-bold">
        {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
      </div>
      {!isCollapsed && (
        <div className="leading-tight">
          <p className="font-medium text-sm">{session?.user?.name || 'Admin'}</p>
          <p className="text-xs text-gray-500">{session?.user?.email || 'Administrator'}</p>
        </div>
      )}
    </div>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <Sidebar>
      <SidebarToggle />
      
      <SidebarHeader>
        <AdminProfileSection />
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenuButton 
            to="/admin/dashboard" 
            icon={LayoutDashboard} 
            isActive={pathname === '/admin/dashboard'}
          >
            Dashboard
          </SidebarMenuButton>
          <SidebarMenuButton 
            to="/admin/posts" 
            icon={FileText} 
            isActive={pathname === '/admin/posts'}
          >
            All Posts
          </SidebarMenuButton>
          <SidebarMenuButton 
            to="/admin/letters" 
            icon={Mail} 
            isActive={pathname === '/admin/letters'}
          >
            Letters
          </SidebarMenuButton>
          <SidebarMenuButton 
            to="/admin/create/new" 
            icon={PlusCircle} 
            isActive={pathname === '/admin/create/new'}
          >
            New Post
          </SidebarMenuButton>
        </SidebarGroup>

        {/* User Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenuButton 
            to="/admin/admins" 
            icon={Users} 
            isActive={pathname === '/admin/admins'}
          >
            Admins
          </SidebarMenuButton>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenuButton 
            to="/" 
            icon={Home}
          >
            Back to Site
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!isCollapsed && (
          <div>
            <button 
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-white/50 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSidebar />
        <div className="flex-1 w-full bg-[var(--color-warm-bg)] min-h-screen transition-all duration-300 pb-20 sm:pb-0">
          {children}
        </div>
      <AdminMobileNav />
    </>
  );
}
