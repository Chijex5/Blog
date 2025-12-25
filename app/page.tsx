import { getBlogPosts } from '@/data/posts';
import BlogCard from '@/components/BlogCard';

export default function Home() {
  const posts = getBlogPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Sharing thoughts, ideas, and experiences about web development, technology, and more.
        </p>
      </div>
      
      <div className="space-y-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
