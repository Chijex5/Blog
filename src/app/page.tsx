import { getBlogPosts } from "@/data/posts"
import Footer from "@/components/Footer"
import type { Metadata } from 'next';
import Newsletter from "./newsLetter"
import FilterablePosts from "@/components/FilterablePosts"

export const revalidate = 60;

// SEO metadata for home page
export const metadata: Metadata = {
  title: "Learning Tech as a Student | Real Talk About Programming and Growth",
  description: "Honest insights about learning programming, dealing with confusion, impostor syndrome, and staying in the game long enough to grow. For beginners who feel lost after the initial excitement.",
  keywords: ["learning programming", "coding for beginners", "impostor syndrome", "tutorial hell", "student developer", "learning tech", "programming journey", "beginner coding"],
  openGraph: {
    title: "Learning Tech as a Student | Real Talk About Programming and Growth",
    description: "Honest insights about learning programming, dealing with confusion, impostor syndrome, and staying in the game long enough to grow.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Tech as a Student | Real Talk About Programming and Growth",
    description: "Honest insights about learning programming, dealing with confusion, impostor syndrome, and staying in the game long enough to grow.",
  },
};

export default async function Home() {
  const posts = await getBlogPosts()

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

      {/* FILTERABLE POSTS COMPONENT */}
      <FilterablePosts posts={posts} />
      
      <Footer />  
    </main>
  )
}
