'use client';

import { useState } from "react"
import BadgeComponent from "@/app/BadgeComponent"
import PostsGrid from "@/components/PostsGrid"
import { BlogPost } from "@/types/blog"
import { BLOG_CATEGORIES } from "@/constants/categories"

const categories = ["All", ...BLOG_CATEGORIES]

interface FilterablePostsProps {
  posts: BlogPost[];
}

export default function FilterablePosts({ posts }: FilterablePostsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <>
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
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
      <PostsGrid initialPosts={posts} selectedCategory={selectedCategory} />
    </>
  )
}
