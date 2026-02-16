import { useState } from 'react'
import Header from './components/Header'
import PromptInput from './components/PromptInput'
import CodeOutput from './components/CodeOutput'
import SettingsPanel from './components/SettingsPanel'
import { useCodeGeneration } from './hooks/useCodeGeneration'

export type LoadingState = 'LOADING' | 'LOADED' | 'INTERRUPTED' | 'FAILED' | undefined

export type GeneratedCode = {
  id: string
  userMessage: string
  aiResponse: string
  timeTaken?: number
  timestamp: number
  loadingState: LoadingState
}

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [codes, setCodes] = useState<GeneratedCode[]>([])
  const [currentCode, setCurrentCode] = useState<GeneratedCode | null>(null)
  
  const {
    isStreaming,
    timeTaken,
    aiResponse,
    loadingState,
    generateCode,
    stopStreaming,
    clearResponse
  } = useCodeGeneration()

  const handleSubmit = async (content: string) => {
    if (currentCode !== null) {
      const deepCopy: GeneratedCode = {
        id: currentCode.id,
        userMessage: currentCode.userMessage,
        timestamp: currentCode.timestamp,
        aiResponse: aiResponse,
        loadingState: loadingState,
        timeTaken: timeTaken,
      }
      setCodes((prev) => [deepCopy, ...prev])
    }
    clearResponse()
    try {
      const id = crypto.randomUUID()
      setCurrentCode({
        id,
        userMessage: content,
        aiResponse: '',
        timestamp: Date.now(),
        loadingState: 'LOADING',
      })
      generateCode.mutate(content)
    } catch (error) {
      console.error('Error generating code:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white p-2 text-black sm:p-4">
      <div className="mx-auto min-h-screen max-w-4xl border-black sm:border-1 sm:p-4">
        <Header onSettingsClick={() => setShowSettings(!showSettings)} />
        
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
        
        <div className="mt-4">
          <PromptInput
            onSubmitAction={handleSubmit}
            isProcessing={isStreaming}
            onStop={stopStreaming}
          />
          <div className="space-y-6">
            {currentCode && (
              <CodeOutput
                key={currentCode.id}
                userMessage={currentCode.userMessage}
                aiResponse={aiResponse}
                loadingState={loadingState}
                timeTaken={timeTaken}
              />
            )}
            {codes.map((code) => (
              <CodeOutput key={code.id} {...code} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
