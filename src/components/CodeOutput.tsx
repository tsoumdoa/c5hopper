import { useEffect, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { codeToHtml } from 'shiki'
import type { LoadingState } from '../types/types'

async function parseMdToHtml(markdown: string) {
  const rawMarkup = marked(markdown) as string
  let sanitizedHtml = DOMPurify.sanitize(rawMarkup)

  const regex = /<pre><code class="([^"]*)">(.*?)<\/code><\/pre>/gs
  const matches: string[] = []
  let match

  while ((match = regex.exec(sanitizedHtml)) !== null) {
    const [, , code] = match
    matches.push(code)
  }

  const PLACEHOLDER = '________________'

  sanitizedHtml = sanitizedHtml.replaceAll(regex, PLACEHOLDER)
  const rg = new RegExp(PLACEHOLDER, 'g')

  let numberOfMatches = matches.length
  let indx = 0

  while ((match = rg.exec(sanitizedHtml)) && indx < numberOfMatches) {
    const escapedHtml = matches[indx]
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&amp;', '&')
    
    try {
      const styledHtml = await codeToHtml(escapedHtml, {
        lang: 'csharp',
        theme: 'dracula-soft',
      })

      const wrappedHtml = `<div class="relative group">
        <button
          onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').innerText).then(() => { this.innerText = 'Copied!'; setTimeout(() => { this.innerText = 'Copy'; }, 2000); })"
          class="absolute right-2 top-2 px-2 py-1 text-xs bg-gray-700 text-white rounded"
        >Copy</button>
        ${styledHtml}
      </div>`

      sanitizedHtml = sanitizedHtml.replace(PLACEHOLDER, wrappedHtml)
    } catch {
      sanitizedHtml = sanitizedHtml.replace(PLACEHOLDER, `<pre><code>${escapedHtml}</code></pre>`)
    }
    indx++
  }

  return { __html: sanitizedHtml }
}

interface CodeOutputProps {
  userMessage: string
  aiResponse: string
  timeTaken?: number
  loadingState: LoadingState
}

export default function CodeOutput({
  userMessage,
  aiResponse,
  timeTaken,
  loadingState,
}: CodeOutputProps) {
  const [content, setContent] = useState<{ __html: string }>({ __html: '' })

  useEffect(() => {
    parseMdToHtml(aiResponse).then((html) => {
      setContent(html)
    })
  }, [aiResponse])

  const getStatusText = () => {
    if (loadingState === 'LOADING') return 'Loading...'
    if (loadingState === 'INTERRUPTED') return 'Interrupted'
    if (loadingState === 'LOADED') return `Inference finished in ${Math.round((timeTaken! * 10) / 1000) / 10}s`
    if (loadingState === 'FAILED') return 'Failed'
    return ''
  }

  return (
    <div className="border-2 border-black bg-white p-2 sm:p-6">
      <div className="space-y-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 pb-2">
            <span className="font-mono text-sm text-gray-600">Prompt</span>
          </div>
          <p className="font-mono text-black sm:border-l-4 sm:border-l-black sm:pl-4">
            {userMessage}
          </p>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 pb-2">
            <span className="font-mono text-sm text-gray-600">{getStatusText()}</span>
          </div>
          <div className="font-mono text-black sm:border-l-4 sm:border-l-black sm:pl-4">
            <div
              className="[&_ol]:space-y-3 [&_ol]:pl-3 [&_ul]:space-y-3 [&_ul]:pl-3 [&>li]:pb-2 [&>li]:text-xs [&>ol]:pb-2 [&>p]:pb-5 [&>div>pre]:mb-5 [&>div>pre]:overflow-x-auto [&>div>pre]:p-5 [&>div>pre]:text-sm"
              dangerouslySetInnerHTML={content}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
