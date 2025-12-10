import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import TechSpecs from "@/components/TechSpecs"
import RegistrationForm from "@/components/RegistrationForm"
import Footer from "@/components/Footer"
import { getDictionary } from "@/dictionaries/get-dictionary"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params
	const dict = await getDictionary(lang)

	return (
		<div className='min-h-screen bg-white'>
			<Navbar dict={dict.navbar} lang={lang} />
			<Hero dict={dict.hero} />
			<Features dict={dict.features} />
			<TechSpecs dict={dict.techSpecs} />
			<RegistrationForm dict={dict.registration} />
			<Footer dict={dict.footer} />
		</div>
	)
}
