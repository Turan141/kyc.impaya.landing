import {VBox} from "../box/Box";
import {Typo} from "../text/Typo";

export const TitledValue = ({title, value}: {title: string; value: any}) => {
	title = title[0].toUpperCase() + title.slice(1);
	title = title.split("_").join(" ");

	if (isNaN(value) && !value) value = "";
	if (value === null) value = "---";
	value = value + "";

	value = value.split("_").join(" ");

	if (
		value &&
		typeof value === "string" &&
		value.indexOf("Z") !== -1 &&
		value.indexOf("T") !== -1 &&
		value.indexOf(":") !== -1 &&
		value.indexOf("-") !== -1
	) {
		try {
			const dta = new Date(value);
			value = dta.toLocaleDateString() + ", " + dta.toLocaleTimeString();
		} catch (e) {}
	}

	return (
		<VBox sx={{gap: "2px"}}>
			<Typo variant="small">{title}:</Typo>
			<Typo variant="medium">{value}</Typo>
		</VBox>
	);
};
