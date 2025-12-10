import axios, { AxiosError, AxiosResponse } from "axios"

const AUTH_TOKEN = "77d1e968e72a3d944ac31729832f77c0d93177413df0c534c9f020f8ba7730212"
const API_URL = "https://kyc.impaya.com/api/v1/"

export interface ApiError {
	code: number
	message: string
	details?: string
}

async function request<T>(
	endpoint: string,
	data: unknown
): Promise<{ data?: T; error?: ApiError }> {
	try {
		const response: AxiosResponse = await axios.post(`${API_URL}${endpoint}`, data, {
			headers: {
				Authorization: `Basic ${AUTH_TOKEN}`
			}
		})
		return { data: response.data }
	} catch (e) {
		const err = e as AxiosError
		if (err.response) {
			const responseData = err.response.data as { error: ApiError }
			return {
				error: responseData.error || {
					code: -1,
					message: typeof responseData === "string" ? responseData : "Unknown error"
				}
			}
		} else {
			return {
				error: {
					code: -1,
					message: err.message || "Network error"
				}
			}
		}
	}
}

export const apiService = {
	// Create sessions
	async createSession() {
		const response = await request("session/generate", {
			allowedCountries: ["Azerbaijan", "Latvia", "LV", "LT", "AZ", "UA"],
			allowedDocs: ["passport", "id-card", "residence-permit"],
			callback_url: "http://localhost:3000/callback", // Placeholder
			redirect_url: "http://localhost:3000/success", // Placeholder
			requiredSteps: ["document-check", "liveness", "utility-check"],
			previousVerifications: {},
			projectPayload: {
				termsUrl: "",
				logoUrl: ""
			}
		})

		if (response.error) throw response.error
		return response.data
	},

	// Check session
	async checkSession(sessionId: string) {
		const response = await request("session/check", {
			sessionId
		})

		if (response.error) throw response.error
		return response.data
	}
}
