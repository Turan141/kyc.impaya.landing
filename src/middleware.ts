import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "es", "it", "de", "lv"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	)

	if (pathnameHasLocale) return

	// Simple redirect to default locale for now to test deployment
	return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
}

export const config = {
	matcher: [
		// Skip all internal paths (_next)
		"/((?!api|_next/static|_next/image|favicon.ico|grid.svg).*)"
	]
}
