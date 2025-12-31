'use client';

import { useState, useEffect } from "react"
import { getBlogPosts } from "@/data/posts"
import BlogCard from "@/components/BlogCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import BadgeComponent from "./BadgeComponent"
import Footer from "@/components/Footer"
import { RiSearchLine } from "react-icons/ri";
import Newsletter from "./newsLetter"
import { BLOG_CATEGORIES } from "@/constants/categories"
import { BlogPost } from "@/types/blog"

const categories = ["All", ...BLOG_CATEGORIES]

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await getBlogPosts()
        setPosts(fetchedPosts)
        setFilteredPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory))
    }
  }, [selectedCategory, posts])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <main className="max-w-7xl mx-auto bg-[var(--color-warm-bg)] md:max-w-[80vw] px-4 py-20">
      {/* HERO */}
      <section className="text-center mb-20 ">
        <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
          From the desk of Chijoke
        </span>

        <h1 className="text-4xl md:text-6xl font-sans font-weight-500 tracking-tight mb-10">
          The real experience of <br />
          <span className="text-4xl md:text-6xl font-normal"> learning <em className="source-serif-italic">tech</em> as a student.</span>
        </h1>

        {/* NEWSLETTER */}
        <Newsletter />
        <p className="text-xs text-muted-foreground mt-3">
          No spam, unsubscribe anytime.
        </p>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
        <div className="md:flex md:flex-row md:flex-wrap grid grid-cols-4 gap-2">
          <BadgeComponent 
            categories={categories} 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          /> 
        </div>

        <div className="relative w-full md:max-w-xs">
      {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <RiSearchLine className="w-5 h-5 text-gray-400" />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search"
            className="
              w-full
              h-11
              pl-10
              pr-4
              rounded-xl
              bg-white
              focus:outline-none
              focus:ring-2 focus:ring-[var(--color-warm-accent)]
              focus:border-transparent
            "
          />
        </div>
      </section>

      {/* BLOG GRID */}
      {isLoading ? (
        <section className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No posts found in this category.</p>
            </div>
          )}
        </section>
      )}
      <Footer />  
    </main>
  )
}
