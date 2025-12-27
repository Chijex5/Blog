import AdminEditor from '@/components/AdminEditor';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPost({ params }: PageProps) {
  const { id } = await params;
  return <AdminEditor postId={id} />;
}
