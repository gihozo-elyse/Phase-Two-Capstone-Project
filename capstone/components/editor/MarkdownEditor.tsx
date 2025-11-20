'use client'

import dynamic from 'next/dynamic'
import rehypeSanitize from 'rehype-sanitize'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  preview?: boolean
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })
const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
)

export default function MarkdownEditor({
  value,
  onChange,
  preview = false,
}: MarkdownEditorProps) {
  if (preview) {
    return (
      <div
        className="border border-gray-700 rounded-lg p-6 min-h-[400px] bg-gray-900"
        data-color-mode="dark"
      >
        <MarkdownPreview
          source={value || '*Start writing your post...*'}
          rehypePlugins={[[rehypeSanitize]]}
        />
      </div>
    )
  }

  return (
    <div
      className="border border-gray-700 rounded-lg bg-gray-900"
      data-color-mode="dark"
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={420}
        visibleDragbar={false}
        preview="edit"
        autoFocus={false}
        textareaProps={{
          placeholder: 'Write your post in Markdown...',
        }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 rounded-b-lg">
        Use the toolbar for bold, italic, headings, lists, links, and code.
      </div>
    </div>
  )
}

