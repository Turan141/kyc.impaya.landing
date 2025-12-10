import {
	ScanFace,
	FileText,
	Home,
	Globe,
	ShieldCheck,
	Zap,
	LucideIcon
} from "lucide-react"

import { Dictionary } from "@/types/dictionary"

export default function Features({ dict }: { dict: Dictionary["features"] }) {
	const featuresList: {
		key: keyof Dictionary["features"]["items"]
		icon: LucideIcon
		color: string
	}[] = [
		{ key: "liveness", icon: ScanFace, color: "bg-blue-500" },
		{ key: "ocr", icon: FileText, color: "bg-indigo-500" },
		{ key: "address", icon: Home, color: "bg-purple-500" },
		{ key: "global", icon: Globe, color: "bg-pink-500" },
		{ key: "security", icon: ShieldCheck, color: "bg-green-500" },
		{ key: "feedback", icon: Zap, color: "bg-yellow-500" }
	]

	return (
		<div className='py-24 bg-white relative overflow-hidden' id='features'>
			<div className='absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30'>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl'></div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='lg:text-center mb-16'>
					<h2 className='text-base text-blue-600 font-semibold tracking-wide uppercase'>
						{dict.capabilities}
					</h2>
					<p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
						{dict.title}
					</p>
					<p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
						{dict.description}
					</p>
				</div>

				<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					{featuresList.map((feature) => (
						<div
							key={feature.key}
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
								{dict.items[feature.key].name}
							</h3>

							<p className='text-base text-gray-500 leading-relaxed'>
								{dict.items[feature.key].desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
