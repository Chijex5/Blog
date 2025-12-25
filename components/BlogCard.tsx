import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
      <Link href={`/blog/${post.id}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
      </Link>
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        <span>•</span>
        <span>{post.readTime}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
