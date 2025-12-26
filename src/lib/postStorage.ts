import { BlogPost } from "@/types/blog";

// Since we're in a client-side environment for the admin, we'll use localStorage
// In a real app, this would be an API call to a backend

export function generatePostId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
}

export function savePost(post: BlogPost): void {
  if (typeof window === 'undefined') return;
  
  const posts = getAllPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.push(post);
  }
  
  localStorage.setItem('blog_posts', JSON.stringify(posts));
}

export function getAllPosts(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('blog_posts');
  return stored ? JSON.parse(stored) : [];
}

export function getPostById(id: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find(p => p.id === id);
}

export function deletePost(id: string): void {
  if (typeof window === 'undefined') return;
  
  const posts = getAllPosts();
  const filtered = posts.filter(p => p.id !== id);
  localStorage.setItem('blog_posts', JSON.stringify(filtered));
}
