import Link from "next/link"
import { BlogPost } from "@/types/blog"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRightIcon } from "lucide-react"

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`}>
      <article className="group rounded-md overflow-hidden bg-white/50 backdrop-blur-sm cursor-pointer transition-all hover:shadow-md">
        {/* IMAGE WITH HOVER SCALE */}
        <div className="aspect-[4/3] p-3 overflow-hidden">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full rounded-sm object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          )}
        </div>

        <div className="p-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* TITLE */}
            <h2 className="text-sm font-medium leading-snug mb-2 text-gray-800 line-clamp-2">
              {post.title}
            </h2>

            {/* DATE AND ONE TAG */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              {post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] rounded-full px-2 py-0"
                  >
                    {post.tags[0]}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* ARROW ICON WITH ROTATE ON HOVER */}
          <div className="bg-white rounded-sm p-1 w-6 h-6 flex items-center justify-center shrink-0">
            <ArrowUpRightIcon
              className="w-3.5 h-3.5 text-black transition-transform duration-200 ease-out group-hover:rotate-45"
            />
          </div>
        </div>
      </article>
    </Link>
  )
}
