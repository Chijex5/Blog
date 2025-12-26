import PostEditor from '@/components/PostEditor';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreatePostWithId({ params }: PageProps) {
  const { id } = await params;
  return <PostEditor postId={id} />;
}
