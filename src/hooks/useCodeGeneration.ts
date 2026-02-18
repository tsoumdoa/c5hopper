import { useState, useRef, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { generateCodeStream } from '../services/openrouter'
import type { LoadingState, OpenRouterMessage, Usage } from '../types/types'

interface GenerationResult {
  response: string
  usage: Usage
}

export function useCodeGeneration() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)
  const [aiResponse, setAiResponse] = useState('')
  const [loadingState, setLoadingState] = useState<LoadingState>(undefined)
  const [usage, setUsage] = useState<Usage>({ promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0 })
  
  const controllerRef = useRef<AbortController | null>(null)
  const startTimeRef = useRef<number>(0)
  const responseRef = useRef<string>('')

  const clearResponse = useCallback(() => {
    setAiResponse('')
    setTimeTaken(0)
    setLoadingState(undefined)
    setUsage({ promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0 })
    responseRef.current = ''
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
    mutationFn: async ({ userPrompt, previousMessages }: { userPrompt: string; previousMessages?: OpenRouterMessage[] }): Promise<GenerationResult> => {
      startTimeRef.current = Date.now()
      responseRef.current = ''
      
      if (controllerRef.current) {
        controllerRef.current.abort('Starting new request')
      }
      
      controllerRef.current = new AbortController()
      setIsStreaming(true)
      setLoadingState('LOADING')

      const usageResult = await generateCodeStream(
        userPrompt,
        (chunk) => {
          responseRef.current += chunk
          setAiResponse(responseRef.current)
        },
        controllerRef.current.signal,
        previousMessages
      )
      
      return { response: responseRef.current, usage: usageResult }
    },
    onSuccess: (result) => {
      setIsStreaming(false)
      const endTime = Date.now()
      setTimeTaken(endTime - startTimeRef.current)
      setUsage(result.usage)
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
    usage,
    generateCode,
    stopStreaming,
    clearResponse,
  }
}
