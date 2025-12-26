import Link from "next/link"
import { BlogPost } from "@/types/blog"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group rounded-sm overflow-hidden bg-white ">
      {/* IMAGE PLACEHOLDER */}
      <div className="aspect-[4/3] p-3">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full  rounded-sm object-cover"
          />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <Link href={`/blog/${post.id}`}>
          <h2 className="text-lg font-medium leading-snug mb-3 group-hover:underline underline-offset-4">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs rounded-full"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  )
}
