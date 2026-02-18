interface HeaderProps {
	onSettingsClick: () => void
}

export default function Header({ onSettingsClick }: HeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<h1 className="text-start">
				<a
					href="https://github.com/tsoumdoa/c5hopper"
					target="_blank"
					rel="noreferrer"
					className="group inline-block border-4 border-black bg-white px-3 py-1.5 font-mono text-xl font-bold uppercase tracking-wider text-black transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
				>
					C5_HOPPER
				</a>
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
