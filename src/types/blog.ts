export interface BlogPost {
  id: string;
  title: string;
  image?: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
}
