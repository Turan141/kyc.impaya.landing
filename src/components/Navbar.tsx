"use client"
import Link from "next/link"
import Image from "next/image"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

import { Dictionary } from "@/types/dictionary"

export default function Navbar({
	dict,
	lang
}: {
	dict: Dictionary["navbar"]
	lang: string
}) {
	const [isLangOpen, setIsLangOpen] = useState(false)
	const pathname = usePathname()
	const router = useRouter()
	const dropdownRef = useRef<HTMLDivElement>(null)

	const languages = [
		{ code: "en", name: "English" },
		{ code: "es", name: "Español" },
		{ code: "it", name: "Italiano" },
		{ code: "de", name: "Deutsch" },
		{ code: "lv", name: "Latviešu" }
	]

	const switchLanguage = (locale: string) => {
		// Replace the locale segment in the pathname
		// Assuming pathname starts with /en, /es, etc.
		const segments = pathname.split("/")
		segments[1] = locale
		const newPath = segments.join("/")
		router.push(newPath)
		setIsLangOpen(false)
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsLangOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [dropdownRef])

	return (
		<nav className='fixed w-full z-50 top-0 start-0 border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-white/60'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16 items-center'>
					<div className='flex items-center'>
						<Link href={`/${lang}`} className='flex items-center gap-2 group'>
							<Image
								src='/ayasec logo.svg'
								alt='Impaya KYC'
								width={150}
								height={40}
								className='h-10 w-auto'
							/>
						</Link>
					</div>
					<div className='hidden md:flex items-center space-x-8'>
						<Link
							href='#features'
							className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
						>
							{dict.features}
						</Link>
						<Link
							href='#tech'
							className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
						>
							{dict.technology}
						</Link>
						<Link
							href='#contact'
							className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
						>
							{dict.contact}
						</Link>

						{/* Language Switcher */}
						<div className='relative' ref={dropdownRef}>
							<button
								onClick={() => setIsLangOpen(!isLangOpen)}
								className='flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
							>
								<Globe className='h-4 w-4' />
								<span className='uppercase'>{lang}</span>
							</button>

							{isLangOpen && (
								<div className='absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1'>
									{languages.map((l) => (
										<button
											key={l.code}
											onClick={() => switchLanguage(l.code)}
											className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
												lang === l.code ? "text-blue-600 font-medium" : "text-gray-700"
											}`}
										>
											{l.name}
										</button>
									))}
								</div>
							)}
						</div>

						<Link
							href='#contact'
							className='bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
						>
							{dict.getStarted}
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}
