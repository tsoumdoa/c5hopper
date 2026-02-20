import type { Thread } from '../types/types'

interface ThreadBarProps {
  threads: Thread[]
  activeThreadId: string | null
  onSelectThread: (threadId: string) => void
  onNewThread: () => void
  onDeleteThread: (threadId: string) => void
}

export default function ThreadBar({ threads, activeThreadId, onSelectThread, onNewThread, onDeleteThread }: ThreadBarProps) {
  const hasEmptyThread = threads.some(t => t.messages.length === 0)

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex min-h-[52px] items-center gap-2 overflow-x-auto p-3">
          {!hasEmptyThread && (
            <button
              onClick={onNewThread}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-black px-3 py-1.5 text-sm font-medium transition-all hover:bg-gray-100"
            >
              <span>+</span>
              <span>New Thread</span>
            </button>
          )}
          
          {threads.map((thread) => {
            const isActive = thread.id === activeThreadId
            const lastMessage = thread.messages[thread.messages.length - 1]
            const preview = lastMessage?.userMessage.slice(0, 30) || 'Empty thread'
            
            return (
              <div
                key={thread.id}
                className={`group relative shrink-0 rounded-lg border transition-colors ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <button
                  onClick={() => onSelectThread(thread.id)}
                  className="flex items-center px-3 py-1.5 text-left text-sm"
                >
                  <div className="max-w-[150px] truncate font-medium">
                    {preview}{preview.length === 30 ? '...' : ''}
                  </div>
                  <div className={`text-xs ml-2 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                    {thread.messages.length}
                  </div>
                </button>
                
                <button
                  onClick={() => onDeleteThread(thread.id)}
                  className="absolute top-1/2 -translate-y-1/2 -right-8 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 opacity-0 transition-all duration-200 hover:border-black hover:bg-white hover:text-black group-hover:right-1 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
