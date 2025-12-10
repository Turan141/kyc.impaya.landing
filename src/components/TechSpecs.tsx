import {
	Cpu,
	Lock,
	Smartphone,
	Zap,
	Server,
	Code,
	Database,
	Cloud,
	LucideIcon
} from "lucide-react"
import { Dictionary } from "@/types/dictionary"

export default function TechSpecs({ dict }: { dict: Dictionary["techSpecs"] }) {
	const specsList: {
		key: keyof Dictionary["techSpecs"]["items"]
		icon: LucideIcon
	}[] = [
		{ key: "tensorflow", icon: Cpu },
		{ key: "secureSessions", icon: Lock },
		{ key: "mobile", icon: Smartphone },
		{ key: "instant", icon: Zap },
		{ key: "api", icon: Server },
		{ key: "developer", icon: Code },
		{ key: "retention", icon: Database },
		{ key: "cloud", icon: Cloud }
	]

	return (
		<div className='relative bg-gray-900 py-24 sm:py-32 overflow-hidden' id='tech'>
			{/* Background Grid */}
			<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

			{/* Glow Effects */}
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10'></div>

			<div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:text-center mb-20'>
					<h2 className='text-base font-semibold leading-7 text-blue-400'>
						{dict.technology}
					</h2>
					<p className='mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
						{dict.title}
					</p>
					<p className='mt-6 text-lg leading-8 text-gray-300'>{dict.description}</p>
				</div>

				<div className='mx-auto max-w-2xl lg:max-w-none'>
					<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4'>
						{specsList.map((spec) => (
							<div key={spec.key} className='flex flex-col relative group'>
								<div className='absolute -inset-4 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10'></div>
								<dt className='flex items-center gap-x-3 text-base font-semibold leading-7 text-white'>
									<div className='p-2 rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:bg-blue-500/20 group-hover:ring-blue-500/50 transition-all'>
										<spec.icon
											className='h-5 w-5 flex-none text-blue-400 group-hover:text-blue-300'
											aria-hidden='true'
										/>
									</div>
									{dict.items[spec.key].name}
								</dt>
								<dd className='mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400 group-hover:text-gray-300 transition-colors'>
									<p className='flex-auto'>{dict.items[spec.key].desc}</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	)
}
