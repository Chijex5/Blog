import AdminEditor from '@/components/AdminEditor';
import { getBlogPost } from '@/data/posts';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPost({ params }: PageProps) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) {
    return notFound();
  } 
  console.log('Editing post with ID:', id);
  return <AdminEditor postId={id} postdata={post} />;
}
