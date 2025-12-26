import { getBlogPosts } from "@/data/posts"
import BlogCard from "@/components/BlogCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import BadgeComponent from "../BadgeComponent"
import Footer from "@/components/Footer"

const categories = ["All", "Audience", "Writing", "Business", "Mindset"]

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <main className="max-w-7xl mx-auto bg-[var(--color-warm-bg)] md:max-w-[80vw] px-4 py-20">
      {/* HERO */}
      <section className="text-center mb-20">
        <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
          From the desk of Skylar
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
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div className="md:flex md:flex-row md:flex-wrap grid grid-cols-4 gap-2">
          <BadgeComponent categories={categories} /> 
        </div>

        <Input
          placeholder="Search"
          className="md:max-w-xs h-11 bg-white shadow-none border-none rounded-lg focus:ring-2 focus:ring-[var(--color-warm-accent)]"
        />
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
