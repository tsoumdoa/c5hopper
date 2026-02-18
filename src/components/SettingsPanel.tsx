import { useState, useEffect } from 'react'
import { getApiKey, setApiKey, clearApiKey, getModel, setModel } from '../utils/storage'

const AVAILABLE_MODELS = [
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku' },
  { value: 'openai/gpt-4o', label: 'GPT-4o' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'google/gemini-pro-1.5', label: 'Gemini Pro 1.5' },
  { value: 'minimax/minimax-m2.5', label: 'Minimax M2.5' },
]

interface SettingsPanelProps {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [apiKey, setApiKeyState] = useState('')
  const [model, setModelState] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedKey = getApiKey()
    const storedModel = getModel()
    setApiKeyState(storedKey || '')
    setModelState(storedModel)
  }, [])

  const handleSave = () => {
    if (apiKey) {
      setApiKey(apiKey)
    } else {
      clearApiKey()
    }
    setModel(model)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    clearApiKey()
    setApiKeyState('')
  }

  return (
    <div className=" border-2 border-black bg-white p-4 my-2">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-bold">Settings</h2>
        <button
          onClick={onClose}
          className="text-sm font-bold hover:text-gray-600"
        >
          Close
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold">OpenRouter API Key</label>
          <p className="mb-2 text-xs text-gray-600">
            Get your free API key from{' '}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-800"
            >
              openrouter.ai
            </a>
          </p>
          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="sk-or-..."
              className="flex-1 resize-none border-2 border-black bg-white px-3 py-2 font-mono text-sm outline-none focus:border-gray-600"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="border-2 border-black bg-white px-3 py-2 text-sm font-bold hover:bg-gray-100"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold">Model</label>
          <select
            value={model}
            onChange={(e) => setModelState(e.target.value)}
            className="w-full border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-gray-600"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className="bg-black px-4 py-2 font-bold text-white hover:bg-neutral-800"
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
          <button
            onClick={handleClear}
            className="border-2 border-black bg-white px-4 py-2 font-bold hover:bg-gray-100"
          >
            Clear API Key
          </button>
        </div>

        <p className="text-xs text-gray-600">
          Your API key is stored locally in your browser and is never sent to any server except OpenRouter.
        </p>
      </div>
    </div>
  )
}
