import { Cpu, Lock, Smartphone, Zap, Server, Code, Database, Cloud } from "lucide-react"

const specs = [
	{
		name: "TensorFlow.js",
		description:
			"Client-side AI processing for immediate feedback and reduced server load. FaceMesh models run directly in the browser.",
		icon: Cpu
	},
	{
		name: "Secure Sessions",
		description:
			"Every verification starts with a unique, time-limited session token. Data is encrypted in transit and at rest.",
		icon: Lock
	},
	{
		name: "Mobile Optimized",
		description:
			"Fully responsive design that works perfectly on mobile devices, utilizing native camera capabilities.",
		icon: Smartphone
	},
	{
		name: "Instant Results",
		description:
			"Get verification results via API callbacks immediately after the user completes the process.",
		icon: Zap
	},
	{
		name: "RESTful API",
		description:
			"Easy to integrate REST API with comprehensive documentation and SDKs for major languages.",
		icon: Server
	},
	{
		name: "Developer Friendly",
		description:
			"Built by developers for developers. Clean code, typed interfaces, and detailed error messages.",
		icon: Code
	},
	{
		name: "Data Retention",
		description:
			"Configurable data retention policies to meet your specific compliance and privacy requirements.",
		icon: Database
	},
	{
		name: "Cloud Native",
		description:
			"Scalable infrastructure hosted on secure cloud providers with high availability and redundancy.",
		icon: Cloud
	}
]

export default function TechSpecs() {
	return (
		<div className='relative bg-gray-900 py-24 sm:py-32 overflow-hidden'>
			{/* Background Grid */}
			<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

			{/* Glow Effects */}
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10'></div>

			<div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:text-center mb-20'>
					<h2 className='text-base font-semibold leading-7 text-blue-400'>
						Technology Stack
					</h2>
					<p className='mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
						Built for Speed and Security
					</p>
					<p className='mt-6 text-lg leading-8 text-gray-300'>
						Our infrastructure is designed to handle high volumes of verifications with
						minimal latency, ensuring your users are verified in seconds, not days.
					</p>
				</div>

				<div className='mx-auto max-w-2xl lg:max-w-none'>
					<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4'>
						{specs.map((spec) => (
							<div key={spec.name} className='flex flex-col relative group'>
								<div className='absolute -inset-4 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10'></div>
								<dt className='flex items-center gap-x-3 text-base font-semibold leading-7 text-white'>
									<div className='p-2 rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:bg-blue-500/20 group-hover:ring-blue-500/50 transition-all'>
										<spec.icon
											className='h-5 w-5 flex-none text-blue-400 group-hover:text-blue-300'
											aria-hidden='true'
										/>
									</div>
									{spec.name}
								</dt>
								<dd className='mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400 group-hover:text-gray-300 transition-colors'>
									<p className='flex-auto'>{spec.description}</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	)
}
