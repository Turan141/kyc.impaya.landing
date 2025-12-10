import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function Navbar() {
	return (
		<nav className='fixed w-full z-50 top-0 start-0 border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-white/60'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16 items-center'>
					<div className='flex items-center'>
						<Link href='/' className='flex items-center gap-2 group'>
							<div className='bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-md group-hover:shadow-blue-500/30 transition-all duration-300'>
								<ShieldCheck className='h-6 w-6 text-white' />
							</div>
							<span className='text-xl font-bold text-gray-900 tracking-tight'>
								Impaya<span className='text-blue-600'>KYC</span>
							</span>
						</Link>
					</div>
					<div className='hidden md:flex items-center space-x-8'>
						<Link
							href='#features'
							className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
						>
							Features
						</Link>
						<Link
							href='#tech'
							className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
						>
							Technology
						</Link>
						<Link
							href='#contact'
							className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
						>
							Contact
						</Link>
						<Link
							href='#register'
							className='bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}
