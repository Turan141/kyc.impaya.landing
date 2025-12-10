import Link from "next/link"
import {
	ArrowRight,
	CheckCircle,
	ShieldCheck,
	ScanFace,
	FileText,
	Play
} from "lucide-react"

export default function Hero() {
	return (
		<div className='relative bg-white overflow-hidden pt-16'>
			{/* Background Elements */}
			<div className='absolute top-0 left-0 w-full h-full overflow-hidden -z-10'>
				<div className='absolute top-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
				<div className='absolute top-0 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
				<div className='absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
				<div className='absolute inset-0 bg-grid-pattern opacity-[0.03]'></div>
			</div>

			<div className='max-w-7xl mx-auto'>
				<div className='relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32'>
					<main className='mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
						<div className='sm:text-center lg:text-left'>
							<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6'>
								<span className='relative flex h-2 w-2'>
									<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
									<span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500'></span>
								</span>
								New Generation KYC
							</div>

							<h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6'>
								<span className='block xl:inline'>Identity Verification</span>{" "}
								<span className='block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 xl:inline'>
									Reimagined with AI
								</span>
							</h1>

							<p className='mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed'>
								Seamlessly onboard users with bank-grade security. Our 3D Liveness
								Detection and Smart OCR technology ensure compliance in seconds, not days.
							</p>

							<div className='mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4'>
								<div className='rounded-md shadow'>
									<Link
										href='#register'
										className='w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-1 md:text-lg'
									>
										Start Verification
										<ArrowRight className='ml-2 h-5 w-5' />
									</Link>
								</div>
								<div className='mt-3 sm:mt-0'>
									<Link
										href='#features'
										className='w-full flex items-center justify-center px-8 py-4 border border-gray-200 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all md:text-lg'
									>
										<Play className='mr-2 h-4 w-4 fill-current' />
										How it Works
									</Link>
								</div>
							</div>

							<div className='mt-8 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-6 text-sm text-gray-500 sm:justify-center lg:justify-start'>
								<div className='flex items-center gap-2'>
									<div className='p-1 bg-blue-100 rounded-full'>
										<ScanFace className='h-3 w-3 text-blue-600' />
									</div>
									<span className='font-medium'>3D Liveness</span>
								</div>
								<div className='flex items-center gap-2'>
									<div className='p-1 bg-blue-100 rounded-full'>
										<FileText className='h-3 w-3 text-blue-600' />
									</div>
									<span className='font-medium'>Smart OCR</span>
								</div>
								<div className='flex items-center gap-2'>
									<div className='p-1 bg-green-100 rounded-full'>
										<ShieldCheck className='h-3 w-3 text-green-600' />
									</div>
									<span className='font-medium'>Bank-grade Security</span>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>

			<div className='lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center py-12 lg:py-0'>
				<div className='relative w-full max-w-lg lg:max-w-xl mx-auto px-4'>
					{/* Abstract decorative elements */}
					<div className='absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
					<div className='absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>

					<div className='relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500'>
						<div className='absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'></div>

						<div className='p-8 space-y-8'>
							{/* Header of the card */}
							<div className='flex items-center justify-between'>
								<div className='space-y-1'>
									<div className='h-2 w-24 bg-gray-200 rounded-full'></div>
									<div className='h-2 w-16 bg-gray-100 rounded-full'></div>
								</div>
								<div className='h-8 w-8 bg-green-100 rounded-full flex items-center justify-center'>
									<CheckCircle className='h-5 w-5 text-green-600' />
								</div>
							</div>

							{/* Main visual - Face Scan */}
							<div className='relative h-64 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden group'>
								<div className='absolute inset-0 opacity-30 grid grid-cols-8 grid-rows-8'>
									{[...Array(64)].map((_, i) => (
										<div key={i} className='border border-blue-500/20'></div>
									))}
								</div>

								{/* Scanning line */}
								<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-[2s] ease-in-out repeat-infinite'></div>

								<div className='relative z-10'>
									<div className='relative'>
										<div className='absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse'></div>
										<ScanFace
											className='h-32 w-32 text-blue-400 relative z-10'
											strokeWidth={1}
										/>
									</div>

									{/* Face landmarks dots */}
									<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-32'>
										<div className='absolute top-[30%] left-[30%] w-1 h-1 bg-blue-300 rounded-full'></div>
										<div className='absolute top-[30%] right-[30%] w-1 h-1 bg-blue-300 rounded-full'></div>
										<div className='absolute bottom-[30%] left-[40%] w-1 h-1 bg-blue-300 rounded-full'></div>
										<div className='absolute bottom-[30%] right-[40%] w-1 h-1 bg-blue-300 rounded-full'></div>
									</div>
								</div>

								<div className='absolute bottom-4 left-0 right-0 text-center'>
									<span className='inline-flex items-center px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-blue-200 text-xs font-mono'>
										<span className='w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse'></span>
										Liveness Detected: 99.8%
									</span>
								</div>
							</div>

							{/* Status steps */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between text-sm'>
									<span className='text-gray-500'>Document Scan</span>
									<span className='text-green-600 font-medium flex items-center'>
										<CheckCircle className='w-3 h-3 mr-1' /> Verified
									</span>
								</div>
								<div className='w-full bg-gray-100 rounded-full h-1.5'>
									<div className='bg-green-500 h-1.5 rounded-full w-full'></div>
								</div>

								<div className='flex items-center justify-between text-sm pt-2'>
									<span className='text-gray-500'>Face Match</span>
									<span className='text-blue-600 font-medium flex items-center'>
										Processing...
									</span>
								</div>
								<div className='w-full bg-gray-100 rounded-full h-1.5 overflow-hidden'>
									<div className='bg-blue-600 h-1.5 rounded-full w-3/4 animate-pulse'></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
