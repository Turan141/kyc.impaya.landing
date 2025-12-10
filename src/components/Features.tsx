import { ScanFace, FileText, Home, Globe, ShieldCheck, Zap } from "lucide-react"

const features = [
	{
		name: "AI-Powered Liveness Detection",
		description:
			"Our advanced 3D FaceMesh technology ensures the user is physically present, preventing spoofing attacks with real-time motion analysis.",
		icon: ScanFace,
		color: "bg-blue-500"
	},
	{
		name: "Smart Document OCR",
		description:
			"Instantly recognize and extract data from Passports, ID Cards, and Residence Permits. Our system automatically detects document boundaries and quality.",
		icon: FileText,
		color: "bg-indigo-500"
	},
	{
		name: "Proof of Address Verification",
		description:
			"Automated utility bill verification ensures compliance with residence requirements. Upload or capture documents directly.",
		icon: Home,
		color: "bg-purple-500"
	},
	{
		name: "Global Coverage",
		description:
			"Support for documents from multiple countries including Azerbaijan, Latvia, Ukraine, and more. Seamlessly verify users worldwide.",
		icon: Globe,
		color: "bg-pink-500"
	},
	{
		name: "Bank-Grade Security",
		description:
			"All data is processed securely with session-based tokens. We adhere to strict data protection standards to keep user information safe.",
		icon: ShieldCheck,
		color: "bg-green-500"
	},
	{
		name: "Real-Time Feedback",
		description:
			'Users receive instant guidance during the process (e.g., "Move Closer", "Hold Still"), ensuring high success rates and a smooth experience.',
		icon: Zap,
		color: "bg-yellow-500"
	}
]

export default function Features() {
	return (
		<div className='py-24 bg-white relative overflow-hidden' id='features'>
			<div className='absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30'>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl'></div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='lg:text-center mb-16'>
					<h2 className='text-base text-blue-600 font-semibold tracking-wide uppercase'>
						Capabilities
					</h2>
					<p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
						Advanced KYC Technology
					</p>
					<p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
						Our platform combines cutting-edge AI with robust compliance checks to deliver
						a seamless verification experience.
					</p>
				</div>

				<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					{features.map((feature) => (
						<div
							key={feature.name}
							className='relative group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
						>
							<div
								className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`}
							></div>

							<div className='flex items-center justify-center h-14 w-14 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors mb-6'>
								<feature.icon
									className='h-7 w-7 text-gray-600 group-hover:text-blue-600 transition-colors'
									aria-hidden='true'
								/>
							</div>

							<h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
								{feature.name}
							</h3>

							<p className='text-base text-gray-500 leading-relaxed'>
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
