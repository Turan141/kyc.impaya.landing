import "server-only"
import type { Dictionary } from "@/types/dictionary"

const dictionaries = {
	en: () => import("./en.json").then((module) => module.default),
	es: () => import("./es.json").then((module) => module.default),
	it: () => import("./it.json").then((module) => module.default),
	de: () => import("./de.json").then((module) => module.default),
	lv: () => import("./lv.json").then((module) => module.default)
}

export const getDictionary = async (locale: string): Promise<Dictionary> => {
	if (dictionaries[locale as keyof typeof dictionaries]) {
		return dictionaries[locale as keyof typeof dictionaries]() as Promise<Dictionary>
	}
	return dictionaries.en() as Promise<Dictionary>
}
