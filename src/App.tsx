import { useState } from 'react'
import Header from './components/Header'
import PromptInput from './components/PromptInput'
import CodeOutput from './components/CodeOutput'
import SettingsPanel from './components/SettingsPanel'
import ThreadBar from './components/ThreadBar'
import { useCodeGeneration } from './hooks/useCodeGeneration'
import type { Thread, ThreadMessage, LoadingState, OpenRouterMessage } from './types/types'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const {
    isStreaming,
    timeTaken,
    aiResponse,
    generateCode,
    stopStreaming,
    clearResponse
  } = useCodeGeneration()

  const activeThread = threads.find(t => t.id === activeThreadId)

  const buildPreviousMessages = (thread: Thread): OpenRouterMessage[] => {
    const messages: OpenRouterMessage[] = []
    for (const msg of thread.messages) {
      if (msg.loadingState === 'LOADED') {
        messages.push({ role: 'user', content: msg.userMessage })
        messages.push({ role: 'assistant', content: msg.aiResponse })
      }
    }
    return messages
  }

  const handleSubmit = async (content: string, continueThread: boolean) => {
    if (isGenerating) return

    let threadId = activeThreadId
    let previousMessages: OpenRouterMessage[] = []

    if (continueThread && activeThread) {
      threadId = activeThreadId
      previousMessages = buildPreviousMessages(activeThread)
    } else {
      threadId = crypto.randomUUID()
      const newThread: Thread = {
        id: threadId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      setThreads(prev => [newThread, ...prev])
      setActiveThreadId(threadId)
    }

    const messageId = crypto.randomUUID()
    const newMessage: ThreadMessage = {
      id: messageId,
      userMessage: content,
      aiResponse: '',
      loadingState: 'LOADING'
    }

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          messages: [...t.messages, newMessage],
          updatedAt: Date.now()
        }
      }
      return t
    }))

    setIsGenerating(true)
    clearResponse()

    try {
      await generateCode.mutateAsync({
        userPrompt: content,
        previousMessages
      })
      
      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.map(m => 
              m.id === messageId
                ? { ...m, aiResponse, loadingState: 'LOADED', timeTaken }
                : m
            ),
            updatedAt: Date.now()
          }
        }
        return t
      }))
    } catch (error) {
      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.map(m => 
              m.id === messageId
                ? { ...m, loadingState: 'FAILED' as LoadingState }
                : m
            ),
            updatedAt: Date.now()
          }
        }
        return t
      }))
    } finally {
      setIsGenerating(false)
      clearResponse()
    }
  }

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId)
  }

  const handleNewThread = () => {
    const newThread: Thread = {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    setThreads(prev => [newThread, ...prev])
    setActiveThreadId(newThread.id)
  }

  return (
    <div className="min-h-screen bg-white p-2 text-black sm:p-4 pb-20">
      <div className="mx-auto min-h-screen max-w-4xl border-black sm:border-1 sm:p-4">
        <Header onSettingsClick={() => setShowSettings(!showSettings)} />
        
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
        
        <div className="mt-4">
          <PromptInput
            onSubmitAction={handleSubmit}
            isProcessing={isStreaming}
            onStop={stopStreaming}
            hasActiveThread={!!activeThread && activeThread.messages.length > 0}
          />
          <div className="space-y-6">
            {activeThread?.messages.map((message) => (
              <CodeOutput
                key={message.id}
                userMessage={message.userMessage}
                aiResponse={message.aiResponse}
                loadingState={message.loadingState}
                timeTaken={message.timeTaken}
              />
            ))}
          </div>
        </div>
      </div>
      
      <ThreadBar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
      />
    </div>
  )
}

export default App
