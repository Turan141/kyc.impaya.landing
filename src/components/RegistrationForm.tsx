"use client"

import { useState } from "react"
import { apiService } from "@/services/api"
import { Loader2, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

import { Dictionary } from "@/types/dictionary"

export default function RegistrationForm({ dict }: { dict: Dictionary["registration"] }) {
	const [email, setEmail] = useState("")
	const [termsAccepted, setTermsAccepted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [successData, setSuccessData] = useState<Record<string, unknown> | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!termsAccepted) {
			setError(dict.form.errorTerms)
			return
		}
		setIsLoading(true)
		setError(null)

		try {
			const data = await apiService.createSession()
			setSuccessData(data as Record<string, unknown>)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : dict.form.errorGeneric
			setError(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	const interpolate = (text: string, params: Record<string, React.ReactNode>) => {
		const parts = text.split(/({.*?})/)
		return parts.map((part, i) => {
			if (part.startsWith("{") && part.endsWith("}")) {
				const key = part.slice(1, -1)
				return <span key={i}>{params[key] || part}</span>
			}
			return <span key={i}>{part}</span>
		})
	}

	if (successData) {
		const token =
			(successData.token as string) ||
			(successData.sessionToken as string) ||
			JSON.stringify(successData)
		return (
			<div className='relative py-24 overflow-hidden' id='contact'>
				<div className='absolute inset-0 bg-gray-50 -z-10'></div>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>

				<div className='relative max-w-md mx-auto px-4 sm:px-6'>
					<div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 text-center'>
						<div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6'>
							<CheckCircle2 className='h-8 w-8 text-green-600' />
						</div>

						<h2 className='text-2xl font-bold text-gray-900 mb-2'>
							{dict.success.title}
						</h2>
						<p className='text-gray-500 mb-8'>{dict.success.description}</p>

						<div className='bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100'>
							<p className='text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2'>
								{dict.success.tokenLabel}
							</p>
							<code className='block text-sm text-blue-600 font-mono break-all bg-white p-3 rounded border border-gray-200'>
								{token}
							</code>
						</div>

						<p className='text-sm text-gray-500 mb-6'>{dict.success.note}</p>

						<button
							onClick={() => setSuccessData(null)}
							className='w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors'
						>
							{dict.success.button}
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='relative py-24 overflow-hidden' id='contact'>
			{/* Background decorations */}
			<div className='absolute inset-0 bg-gray-50 -z-10'></div>
			<div className='absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
			<div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>

			<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid lg:grid-cols-2 gap-12 items-center'>
					<div>
						<h2 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-4'>
							{dict.form.title}
						</h2>
						<p className='text-lg text-gray-500 mb-8'>{dict.form.description}</p>

						<ul className='space-y-4 mb-8'>
							{dict.form.list.map((item: string, i: number) => (
								<li key={i} className='flex items-center text-gray-600'>
									<CheckCircle2 className='h-5 w-5 text-blue-500 mr-3' />
									{item}
								</li>
							))}
						</ul>
					</div>

					<div className='relative'>
						<div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-20'></div>
						<div className='relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 sm:p-10'>
							<div className='mb-8'>
								<h3 className='text-xl font-bold text-gray-900'>
									{dict.form.createAccount}
								</h3>
								<p className='text-sm text-gray-500'>{dict.form.trial}</p>
							</div>

							<form onSubmit={handleSubmit} className='space-y-6'>
								<div>
									<label
										htmlFor='email'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										{dict.form.emailLabel}
									</label>
									<div className='relative'>
										<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
											<Mail className='h-5 w-5 text-gray-400' />
										</div>
										<input
											id='email'
											name='email'
											type='email'
											autoComplete='email'
											required
											className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all'
											placeholder={dict.form.emailPlaceholder}
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
								</div>

								<div className='flex items-start'>
									<div className='flex items-center h-5'>
										<input
											id='terms'
											name='terms'
											type='checkbox'
											className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
											checked={termsAccepted}
											onChange={(e) => setTermsAccepted(e.target.checked)}
										/>
									</div>
									<div className='ml-3 text-sm'>
										<label htmlFor='terms' className='font-medium text-gray-700'>
											{interpolate(dict.form.terms, {
												terms: (
													<a href='#' className='text-blue-600 hover:text-blue-500'>
														{dict.form.termsLink}
													</a>
												),
												privacy: (
													<a href='#' className='text-blue-600 hover:text-blue-500'>
														{dict.form.privacyLink}
													</a>
												)
											})}
										</label>
									</div>
								</div>

								{error && (
									<div className='rounded-md bg-red-50 p-4 flex items-start'>
										<AlertCircle className='h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0' />
										<p className='text-sm text-red-700'>{error}</p>
									</div>
								)}

								<button
									type='submit'
									disabled={isLoading}
									className='w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-0.5'
								>
									{isLoading ? (
										<>
											<Loader2 className='animate-spin -ml-1 mr-2 h-4 w-4' />
											{dict.form.buttonProcessing}
										</>
									) : (
										<>
											{dict.form.buttonStart}
											<ArrowRight className='ml-2 h-4 w-4' />
										</>
									)}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
