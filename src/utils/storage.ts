const STORAGE_KEYS = {
  API_KEY: 'c5-hopper-api-key',
  MODEL: 'c5-hopper-model',
} as const

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEYS.API_KEY)
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key)
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEYS.API_KEY)
}

export function getModel(): string {
  return localStorage.getItem(STORAGE_KEYS.MODEL) || 'anthropic/claude-3.5-sonnet'
}

export function setModel(model: string): void {
  localStorage.setItem(STORAGE_KEYS.MODEL, model)
}
