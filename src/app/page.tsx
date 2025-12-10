import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import TechSpecs from "@/components/TechSpecs"
import RegistrationForm from "@/components/RegistrationForm"
import Footer from "@/components/Footer"

export default function Home() {
	return (
		<div className='min-h-screen bg-white'>
			<Navbar />
			<Hero />
			<Features />
			<TechSpecs />
			<RegistrationForm />
			<Footer />
		</div>
	)
}
