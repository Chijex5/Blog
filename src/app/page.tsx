import { getBlogPosts } from "@/data/posts"
import BlogCard from "@/components/BlogCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import BadgeComponent from "./BadgeComponent"
import Footer from "@/components/Footer"
import { RiSearchLine } from "react-icons/ri";

const categories = ["All", "Audience", "Writing", "Business", "Mindset"]

export default function Home() {
  const posts = getBlogPosts()

  return (
    <main className="max-w-7xl mx-auto bg-[var(--color-warm-bg)] md:max-w-[80vw] px-4 py-20">
      {/* HERO */}
      <section className="text-center mb-20 ">
        <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
          From the desk of Chijoke
        </span>

        <h1 className="text-4xl md:text-6xl font-sans font-weight-500 tracking-tight mb-10">
          Ideas and insights for <br />
          <span className="text-4xl md:text-6xl font-normal"> the <em className="source-serif-italic">modern</em> creator.</span>
        </h1>

        {/* NEWSLETTER */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Input
            placeholder="Your email"
            className="h-11 bg-white shadow-none border-none rounded-xl"
          />
          <Button className="h-11 px-6 rounded-xl">Subscribe</Button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          No spam, unsubscribe anytime.
        </p>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
        <div className="md:flex md:flex-row md:flex-wrap grid grid-cols-4 gap-2">
          <BadgeComponent categories={categories} /> 
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
      <section className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </section>
      <Footer />  
    </main>
  )
}
