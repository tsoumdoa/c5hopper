import { useState, useRef, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { generateCodeStream } from '../services/openrouter'
import type { LoadingState, OpenRouterMessage } from '../types/types'

export function useCodeGeneration() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)
  const [aiResponse, setAiResponse] = useState('')
  const [loadingState, setLoadingState] = useState<LoadingState>(undefined)
  
  const controllerRef = useRef<AbortController | null>(null)
  const startTimeRef = useRef<number>(0)

  const clearResponse = useCallback(() => {
    setAiResponse('')
    setTimeTaken(0)
    setLoadingState(undefined)
  }, [])

  const stopStreaming = useCallback(() => {
    setIsStreaming(false)
    setLoadingState('INTERRUPTED')
    if (controllerRef.current) {
      controllerRef.current.abort('User stopped streaming')
      controllerRef.current = null
    }
  }, [])

  const generateCode = useMutation({
    mutationFn: async ({ userPrompt, previousMessages }: { userPrompt: string; previousMessages?: OpenRouterMessage[] }) => {
      startTimeRef.current = Date.now()
      
      if (controllerRef.current) {
        controllerRef.current.abort('Starting new request')
      }
      
      controllerRef.current = new AbortController()
      setIsStreaming(true)
      setLoadingState('LOADING')

      await generateCodeStream(
        userPrompt,
        (chunk) => {
          setAiResponse((prev) => prev + chunk)
        },
        controllerRef.current.signal,
        previousMessages
      )
    },
    onSuccess: () => {
      setIsStreaming(false)
      const endTime = Date.now()
      setTimeTaken(endTime - startTimeRef.current)
      setLoadingState('LOADED')
      controllerRef.current = null
    },
    onError: (error) => {
      setIsStreaming(false)
      if (error instanceof Error && error.name === 'AbortError') {
        // Already handled by stopStreaming
      } else {
        setLoadingState('FAILED')
        console.error('Code generation error:', error)
      }
      controllerRef.current = null
    },
  })

  return {
    isStreaming,
    timeTaken,
    aiResponse,
    loadingState,
    generateCode,
    stopStreaming,
    clearResponse,
  }
}
