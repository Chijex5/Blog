"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { JSONContent } from '@tiptap/core';

interface TiptapRendererProps {
  content: string | JSONContent;
}

export default function TiptapRenderer({ content }: TiptapRendererProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none focus:outline-none',
      },
    },
  });

  return <EditorContent editor={editor} />;
}
