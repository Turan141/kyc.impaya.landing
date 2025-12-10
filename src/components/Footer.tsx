import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
	return (
		<footer className='bg-gray-900 border-t border-gray-800'>
			<div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-8'>
					<div className='col-span-2 md:col-span-1'>
						<span className='text-2xl font-bold text-white'>
							Impaya<span className='text-blue-500'>KYC</span>
						</span>
						<p className='mt-4 text-sm text-gray-400'>
							Next-generation identity verification platform for modern businesses.
							Secure, fast, and compliant.
						</p>
					</div>
					<div>
						<h3 className='text-sm font-semibold text-gray-400 tracking-wider uppercase'>
							Solutions
						</h3>
						<ul className='mt-4 space-y-4'>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									Identity Verification
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									AML Screening
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									Document OCR
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className='text-sm font-semibold text-gray-400 tracking-wider uppercase'>
							Support
						</h3>
						<ul className='mt-4 space-y-4'>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									Documentation
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									API Reference
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									System Status
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className='text-sm font-semibold text-gray-400 tracking-wider uppercase'>
							Legal
						</h3>
						<ul className='mt-4 space-y-4'>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-base text-gray-300 hover:text-blue-400 transition-colors'
								>
									Cookie Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4'>
					<p className='text-base text-gray-400'>
						&copy; {new Date().getFullYear()} Impaya KYC. All rights reserved.
					</p>
					<div className='flex space-x-6'>
						<Link href='#' className='text-gray-400 hover:text-white transition-colors'>
							<span className='sr-only'>GitHub</span>
							<Github className='h-6 w-6' />
						</Link>
						<Link href='#' className='text-gray-400 hover:text-white transition-colors'>
							<span className='sr-only'>Twitter</span>
							<Twitter className='h-6 w-6' />
						</Link>
						<Link href='#' className='text-gray-400 hover:text-white transition-colors'>
							<span className='sr-only'>LinkedIn</span>
							<Linkedin className='h-6 w-6' />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
