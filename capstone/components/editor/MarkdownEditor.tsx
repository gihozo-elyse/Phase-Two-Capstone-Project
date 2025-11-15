'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  preview?: boolean
}

export default function MarkdownEditor({
  value,
  onChange,
  preview = false,
}: MarkdownEditorProps) {
  if (preview) {
    return (
      <div className="border border-gray-700 rounded-lg p-6 min-h-[400px] bg-gray-900">
        <div className="markdown-content prose prose-lg max-w-none prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-800 text-yellow-400 px-1 rounded" {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {value || '*Start writing your post...*'}
          </ReactMarkdown>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-700 rounded-lg">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your post in Markdown..."
        className="w-full px-4 py-3 min-h-[400px] bg-gray-900 text-white border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg resize-none placeholder-gray-500"
      />
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 rounded-b-lg">
        Supports Markdown formatting. Use **bold**, *italic*, # headings, etc.
      </div>
    </div>
  )
}

