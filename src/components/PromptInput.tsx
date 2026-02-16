import { useState, useRef, useEffect } from 'react'

interface PromptInputProps {
  onSubmitAction: (content: string) => void
  isProcessing?: boolean
  onStop?: () => void
}

export default function PromptInput({
  onSubmitAction,
  isProcessing = false,
  onStop,
}: PromptInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isProcessing) {
      onSubmitAction(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-4">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to achieve in Grasshopper..."
          rows={1}
          className="flex-1 resize-none overflow-hidden border-2 border-black bg-white px-4 py-3 font-mono text-black placeholder-gray-500 transition-colors outline-none focus:border-gray-600"
          disabled={isProcessing}
        />
        <button
          type={isProcessing ? 'button' : 'submit'}
          className={`bg-black px-4 py-3 font-mono font-bold uppercase transition-colors disabled:opacity-50 disabled:hover:bg-black ${isProcessing ? 'bg-red-500 text-white' : 'text-white hover:bg-neutral-800'}`}
          disabled={!message.trim() && !isProcessing}
          onClick={isProcessing ? onStop : undefined}
        >
          {isProcessing ? 'STOP' : 'SEND'}
        </button>
      </div>
    </form>
  )
}
