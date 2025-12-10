export interface FeatureItem {
	name: string
	desc: string
}

export interface Dictionary {
	navbar: {
		features: string
		technology: string
		contact: string
		getStarted: string
	}
	hero: {
		newGeneration: string
		title: string
		titleHighlight: string
		description: string
		startVerification: string
		howItWorks: string
		liveness: string
		ocr: string
		security: string
		card: {
			livenessDetected: string
			documentScan: string
			verified: string
			faceMatch: string
			processing: string
			deviceCheck: string
		}
	}
	features: {
		capabilities: string
		title: string
		description: string
		items: {
			liveness: FeatureItem
			ocr: FeatureItem
			address: FeatureItem
			global: FeatureItem
			security: FeatureItem
			feedback: FeatureItem
		}
	}
	techSpecs: {
		technology: string
		title: string
		description: string
		items: {
			tensorflow: FeatureItem
			secureSessions: FeatureItem
			mobile: FeatureItem
			instant: FeatureItem
			api: FeatureItem
			developer: FeatureItem
			retention: FeatureItem
			cloud: FeatureItem
		}
	}
	registration: {
		success: {
			title: string
			description: string
			tokenLabel: string
			note: string
			button: string
		}
		form: {
			title: string
			description: string
			list: string[]
			createAccount: string
			trial: string
			emailLabel: string
			emailPlaceholder: string
			terms: string
			termsLink: string
			privacyLink: string
			errorTerms: string
			errorGeneric: string
			buttonProcessing: string
			buttonStart: string
		}
	}
	footer: {
		tagline: string
		solutions: string
		support: string
		legal: string
		rights: string
		links: {
			identity: string
			aml: string
			ocr: string
			docs: string
			api: string
			status: string
			privacy: string
			terms: string
			cookie: string
		}
	}
}
