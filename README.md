# C5 Hopper

A local AI-powered tool for generating C# scripts for Grasshopper (Rhino 3D).

## Features

- **AI Code Generation**: Generate C# code for Grasshopper components using OpenRouter API
- **Thread-based Conversations**: Create and manage multiple conversation threads
- **Context-aware Responses**: Continue conversations with previous code as context
- **Copy as GH Component**: Copy generated code directly as Grasshopper component XML (base64 encoded)
- **Local Persistence**: Threads are saved locally using IndexedDB (via Dexie.js)
- **Cost Tracking**: View token usage and cost per request

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open `http://localhost:5173` in your browser

4. Configure your OpenRouter API key in Settings (click the gear icon)

## Usage

1. Enter a prompt describing what you want the Grasshopper component to do
2. Choose "Continue thread" to include previous messages as context, or "New thread" to start fresh
3. The AI generates C# code ready to paste into a Grasshopper C# component
4. Click "Copy as GH Component" to copy the code wrapped in Grasshopper XML format
5. In Grasshopper, create a new C# component, open the script editor, and paste

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Dexie.js (IndexedDB)
- Shiki (syntax highlighting)
- OpenRouter API

