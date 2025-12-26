import { JSONContent } from '@tiptap/core';

export interface BlogPost {
  id: string;
  title: string;
  image?: string;
  excerpt: string;
  content: JSONContent; // Tiptap JSON content
  date: string;
  author: string;
  tags: string[];
  readTime: string;
}
