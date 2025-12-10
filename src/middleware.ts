import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

const locales = ["en", "es", "it", "de", "lv"]
const defaultLocale = "en"

function getLocale(request: NextRequest) {
	const headers = { "accept-language": request.headers.get("accept-language") || "" }
	const languages = new Negotiator({ headers }).languages()
	return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	)

	if (pathnameHasLocale) return

	// Redirect if there is no locale
	const locale = getLocale(request)
	return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
}

export const config = {
	matcher: [
		// Skip all internal paths (_next)
		"/((?!api|_next/static|_next/image|favicon.ico|grid.svg).*)",
	]
}
