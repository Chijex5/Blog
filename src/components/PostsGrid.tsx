'use client';

import { useState, useEffect } from "react"
import BlogCard from "@/components/BlogCard"
import { BlogPost } from "@/types/blog"

interface PostsGridProps {
  initialPosts: BlogPost[];
  selectedCategory: string;
}

export default function PostsGrid({ initialPosts, selectedCategory }: PostsGridProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(initialPosts)
    } else {
      setFilteredPosts(initialPosts.filter(post => post.category === selectedCategory))
    }
  }, [selectedCategory, initialPosts])

  return (
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
  )
}
