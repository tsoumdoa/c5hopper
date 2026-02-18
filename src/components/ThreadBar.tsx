import type { Thread } from '../types/types'

interface ThreadBarProps {
  threads: Thread[]
  activeThreadId: string | null
  onSelectThread: (threadId: string) => void
  onNewThread: () => void
}

export default function ThreadBar({ threads, activeThreadId, onSelectThread, onNewThread }: ThreadBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 overflow-x-auto p-3">
          <button
            onClick={onNewThread}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-black px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100"
          >
            <span>+</span>
            <span>New Thread</span>
          </button>
          
          {threads.map((thread) => {
            const isActive = thread.id === activeThreadId
            const lastMessage = thread.messages[thread.messages.length - 1]
            const preview = lastMessage?.userMessage.slice(0, 30) || 'Empty thread'
            
            return (
              <button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-left text-sm transition-colors ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="max-w-[150px] truncate font-medium">
                  {preview}{preview.length === 30 ? '...' : ''}
                </div>
                <div className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                  {thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
