# Grasshopper C# Code Generator

## Project Name
C5 Hopper

## Project Overview
A Single Page Application (SPA) that generates C# code specifically targeting the Grasshopper C# component in Rhino. Users can describe what they want to achieve in Grasshopper, and the app uses LLM to generate appropriate C# code.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18+ |
| Build Tool | Vite 5+ |
| Styling | Tailwind CSS v4 |
| State Management | TanStack Query (React Query) |
| AI/LLM | OpenRouter API |
| Package Manager | pnpm |
| Language | TypeScript |

## Architecture Decisions

### 1. Vite as Build Tool
- Fast HMR (Hot Module Replacement)
- Optimized production builds
- Native ESM support
- Simple configuration

### 2. Tailwind CSS v4
- Utility-first CSS framework
- Built-in dark mode support
- Highly customizable
- v4 brings improved performance and new features

### 3. TanStack Query
- Server state management
- Caching and synchronization
- Background refetching
- Optimistic updates
- Perfect for LLM API calls

### 4. OpenRouter Integration
- Single API for multiple LLM providers
- User brings their own API key
- No backend required (client-side only)

## Overall UI design 
 Please refer to the style of gh-code-gen project. Please use inline class style since
 this is tailwind.


## File Structure

```
grasshopper-cs-gen/
├── src/
│   ├── components/           # React components
│   │   ├── CodeOutput.tsx    # Display generated code
│   │   ├── PromptInput.tsx   # User input for code generation
│   │   ├── SettingsPanel.tsx # API key settings
│   │   └── Header.tsx        # App header
│   ├── hooks/                # Custom React hooks
│   │   ├── useCodeGeneration.ts
│   │   └── useLocalStorage.ts
│   ├── services/             # API services
│   │   └── openrouter.ts
│   ├── types/                # TypeScript types
│   │   └── types.ts
│   ├── utils/                # Utility functions
│   │   └── storage.ts        # localStorage/cookie helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .gitignore
```

## Implementation Phases

### Phase 1: Project Setup
1. Initialize Vite project with React + TypeScript
2. Install and configure Tailwind CSS v4
3. Install TanStack Query
4. Setup project structure

### Phase 2: Core UI Components
1. Create main layout
2. Build prompt input component
3. Build code output component with syntax highlighting
4. Create settings panel for API key

### Phase 3: API Integration
1. Implement OpenRouter service
2. Create code generation hook
3. Handle API errors and loading states
4. Add response streaming (optional)

### Phase 4: Security & UX
1. Implement secure API key storage
2. Add copy-to-clipboard for generated code
3. Add code history/local caching
4. Error handling and validation

### Phase 5: Polish
1. Dark/light mode toggle
2. Responsive design
3. Code syntax highlighting
4. Loading animations

## Security Considerations

### API Key Storage
**Chosen approach: localStorage**

- localStorage is isolated per origin
- No automatic transmission (unlike cookies)
- Easier to clear/manage for users
- Suitable for client-side only apps

**Implementation:**
- Never log or expose the API key
- Clear key from memory on logout
- Warn users about security implications
- Option to use sessionStorage for temporary storage

## Dependencies
- React 18+
- Tailwind CSS v4
- Vite 5+
- Shiki (code syntax highlighting, you can have a look at gh-code-gen project
  for the implementation)


## Prompt Engineering Strategy

### System Prompt for Grasshopper C# Generation
```
You are an expert in Rhino/Grasshopper C# scripting. Generate C# code for the Grasshopper C# component that:
1. Uses the Grasshopper SDK types (GH_Structure, IGH_Goo, etc.)
2. Follows Grasshopper C# component patterns
3. Includes proper input/output parameter handling
4. Uses efficient algorithms for geometry operations
5. Includes error handling

The code should be ready to paste directly into a Grasshopper C# component.

The code you out put needs to be in this style:

```csharp
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
```

### User Prompt Template
```
Task: {user_description}

Inputs: {input_params}
Outputs: {output_params}

Generate C# code that accomplishes this task.
```

