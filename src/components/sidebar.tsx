"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  Home,
  User,
  Mail,
  GithubIcon,
  FileText,
  PinIcon,
  ChevronLeft,
  ArrowUpRightIcon,
} from "lucide-react"
import { Input } from "./ui/input"
import { useRouter, usePathname } from "next/navigation"
import { BsTwitterX } from "react-icons/bs";
import SubscribedModal from "./subscribed-modal"

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
      className={`hidden md:block fixed left-0 top-0 h-screen bg-[var(--color-warm-accent)] transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? "w-[4.5rem] px-2" : "w-[15rem] px-3"
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
        className={`absolute top-15 z-50 rounded-full bg-black shadow-md text-white flex items-center justify-center transition-all duration-300 ease-in-out ${isCollapsed ? '-right-3' : '-right-4'}`}
        style={{
            width: isCollapsed ? '18px' : '24px',
            height: isCollapsed ? '18px' : '24px',
        }}
        >
        <div
            className="transition-transform duration-300 ease-in-out flex items-center justify-center"
            style={{
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
        >
            {isCollapsed ? (
            <ChevronLeft className="h-3 w-3" />
            ) : (
            <ChevronLeft className="h-4 w-4" />
            )}
        </div>
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
    <div className={`px-2 py-2 ${className}`}>
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
  to,
  isExternal = false,
  badge,
  showArrow = false,
}: {
  children: React.ReactNode
  isActive?: boolean
  to: string
  isExternal?: boolean
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  showArrow?: boolean
}) {
  const { isCollapsed } = useSidebar()
  const router = useRouter()

  return (
    <button
      className={`w-full group flex items-center mb-2 gap-4 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-white text-gray-900"
          : "text-gray-700 hover:bg-white/50"
      } ${isCollapsed ? "justify-center w-8 h-8" : ""}`}
      onClick={()=> {
        if(isExternal){
            window.open(to, "_blank");
            return
        }
        router.push(to)
      }}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left text-sm">{children}</span>
          {badge && (
            <span className="text-xs bg-white rounded-md px-2 py-0.5">
              {badge}
            </span>
          )}
          {showArrow && (
            <div className="bg-white rounded-sm p-1 w-6 h-6 flex items-center justify-center shrink-0">
                <ArrowUpRightIcon
                    className="w-3.5 h-3.5 text-black transition-transform duration-200 ease-out group-hover:rotate-45"
                />
            </div>
          )}
        </>
      )}
    </button>
  )
}

// Demo App Component
export default function SidebarApp() {
    const pathname = usePathname();
    if (pathname.startsWith('/admin')) {
      return null;
    }
  return (
      <Sidebar>
        <SidebarToggle />
        
        <SidebarHeader>
          <ProfileSection />
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarMenuButton to="/" icon={Home} isActive={pathname === "/"}>
              Home
            </SidebarMenuButton>
            <SidebarMenuButton to="/about" icon={User} isActive={pathname === "/about"}>
              About
            </SidebarMenuButton>
          </SidebarGroup>

          {/* Find Me Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Find me</SidebarGroupLabel>
            <SidebarMenuButton to="https://x.com/chijex5" isExternal icon={BsTwitterX} showArrow>
              Twitter
            </SidebarMenuButton>
            <SidebarMenuButton to="https://github.com/chijex5" isExternal icon={GithubIcon} showArrow>
              GitHub
            </SidebarMenuButton>
            <SidebarMenuButton to="mailto:contact@example.com" isExternal icon={Mail} showArrow>
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
      <img src={'https://res.cloudinary.com/dc3yttemx/image/upload/v1766771782/calvinnova-products/l8kh5pv4rinceewuiwhr.png'} alt="profile picture" className="w-10 h-10 rounded-full bg-gray-300 shrink-0" />
      {!isCollapsed && (
        <div className="leading-tight">
          <p className="font-medium text-sm">Chijoke Uzodinma</p>
          <p className="text-xs text-gray-500">Full Stack Developer</p>
        </div>
      )}
    </div>
  )
}

// Pinned Section Component
function PinnedSection() {
  const { isCollapsed } = useSidebar()
  const [pinnedPost, setPinnedPost] = useState<{
    id: string;
    title: string;
    image?: string;
    slug: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPinnedPost()
  }, [])

  const fetchPinnedPost = async () => {
    try {
      const response = await fetch('/api/posts/pinned')
      if (response.ok) {
        const data = await response.json()
        setPinnedPost(data)
      }
    } catch (error) {
      console.error('Error fetching pinned post:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't show anything while loading
  if (loading) return null

  // Show nothing if no pinned post
  if (!pinnedPost) return null

  if (isCollapsed) return (
    <SidebarGroup>
      <SidebarMenuButton to={`/post/${pinnedPost.slug}`} icon={PinIcon}>Pinned</SidebarMenuButton>
    </SidebarGroup>
  )

  return (
    <SidebarGroup>
        <button 
          onClick={() => router.push(`/post/${pinnedPost.slug}`)}
          className="group bg-white/50 rounded-md flex flex-col p-3 backdrop-blur-sm cursor-pointer hover:bg-white/70 transition-colors"
        >
            <p className="text-[10px] font-medium text-gray-500 uppercase px-2 py-1 mb-1">
                Pinned
            </p>

            {pinnedPost.image && (
              <img 
                src={pinnedPost.image} 
                className="w-full h-32 rounded-sm object-cover" 
                alt={pinnedPost.title} 
              />
            )}

            <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-[10px] font-medium text-gray-800 max-w-[60%] leading-snug line-clamp-2 text-left">
                  {pinnedPost.title}
                </p>

                <div className="bg-white rounded-sm p-1 w-6 h-6 flex items-center justify-center shrink-0">
                  <ArrowUpRightIcon
                      className="w-3.5 h-3.5 text-black transition-transform duration-200 ease-out group-hover:rotate-45"
                  />
                </div>
            </div>
         </button>
    </SidebarGroup>
  )
}

// Newsletter Form Component
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <p className="font-medium mb-2 text-sm">Stay in the loop</p>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        placeholder="Your email"
        className="w-full bg-white shadow-none border-none rounded-lg px-3 py-2 text-sm mb-3"
      />
      <button disabled={loading} onClick={handleSubscribe} className="w-full rounded-md bg-black py-2 text-white text-sm hover:bg-gray-800 transition-colors">
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {showModal && <SubscribedModal onClose={() => setShowModal(false)} />}
    </div>
  )
}