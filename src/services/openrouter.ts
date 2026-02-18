import { getApiKey, getModel } from '../utils/storage'
import type { OpenRouterMessage } from '../types/types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const SYSTEM_PROMPT = `You are an expert in Rhino/Grasshopper C# scripting. Generate C# code for the Grasshopper C# component that:
1. Uses the Grasshopper SDK types (GH_Structure, IGH_Goo, etc.)
2. Follows Grasshopper C# component patterns
3. Includes proper input/output parameter handling
4. Uses efficient algorithms for geometry operations
5. Includes error handling

The code should be ready to paste directly into a Grasshopper C# component.

The code you output needs to be in this style:

\`\`\`csharp
// Grasshopper Script Instance
using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;

using Rhino;
using Rhino.Geometry;

using Grasshopper;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Types;

public class Script_Instance : GH_ScriptInstance
{
    private void RunScript(object x, object y, ref object a)
    {
        a = null;
    }
}
\`\`\`

Only output the C# code, no explanations.`

export async function generateCodeStream(
  userPrompt: string,
  onChunk: (chunk: string) => void,
  signal: AbortSignal,
  previousMessages: OpenRouterMessage[] = []
): Promise<void> {
  const apiKey = getApiKey()
  const model = getModel()

  if (!apiKey) {
    throw new Error('API key not configured')
  }

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...previousMessages,
    { role: 'user', content: userPrompt },
  ]

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'C5 Hopper',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `HTTP error! Status: ${response.status}`)
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported in this environment.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value)
      const lines = text.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              onChunk(content)
            }
          } catch {
            // Ignore parse errors for malformed chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
