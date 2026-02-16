interface HeaderProps {
  onSettingsClick: () => void
}

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-start text-2xl font-bold">
        C5 Hopper - Grasshopper C# Generator
      </h1>
      <button
        onClick={onSettingsClick}
        className="ml-4 rounded border-2 border-black bg-white px-3 py-2 text-sm font-bold hover:bg-gray-100 focus:ring-1 focus:ring-black/50 focus:ring-offset-1 focus:outline-none"
      >
        Settings
      </button>
    </div>
  )
}
