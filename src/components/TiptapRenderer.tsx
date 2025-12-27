"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { JSONContent } from '@tiptap/core';
import { useEffect } from 'react';

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
        class: 'prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-img:rounded-lg prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic focus:outline-none',
      },
    },
  });

  // Update content when it changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
