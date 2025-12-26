import { getBlogPosts } from "@/data/posts"
import BlogCard from "@/components/BlogCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import BadgeComponent from "./BadgeComponent"

const categories = ["All", "Audience", "Writing", "Business", "Mindset"]

export default function Home() {
  const posts = getBlogPosts()

  return (
    <main className="max-w-7xl mx-auto bg-[#f5f2f0] px-4 py-20">
      {/* HERO */}
      <section className="text-center mb-20">
        <span className="inline-block mb-6 rounded-full bg-[#ede8e6] px-4 py-1 text-sm">
          From the desk of Skylar
        </span>

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-10">
          Ideas and insights for <br />
          <span className="italic font-normal">the modern creator.</span>
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
      <section className="flex flex-col md:flex-row md:items-center md:justify-between md:max-w-[70vw] gap-6 mb-12">
        <div className="flex flex-wrap gap-2">
          <BadgeComponent categories={categories} /> 
        </div>

        <Input
          placeholder="Search"
          className="md:max-w-xs"
        />
      </section>

      {/* BLOG GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 md:max-w-[70vw] lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  )
}
