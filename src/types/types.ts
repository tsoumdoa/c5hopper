export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  stream: boolean
}

export interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
}

export type LoadingState = 'LOADING' | 'LOADED' | 'INTERRUPTED' | 'FAILED' | undefined

export interface ThreadMessage {
  id: string
  userMessage: string
  aiResponse: string
  timeTaken?: number
  loadingState: LoadingState
}

export interface Thread {
  id: string
  messages: ThreadMessage[]
  createdAt: number
  updatedAt: number
}

export interface CodeGenerationResult {
  code: string
  timeTaken?: number
}
