import { Typo } from "../text/Typo";
import {  HBox } from "../box/Box";
import { isLightColor } from "../theme/GlobalTheme";

export const Badge = ({ label, color }: { label: string; color?: string }) => {
	if (!color) {
		let lbl = label.toLowerCase().trim();
		color = "#C3F0C0";

		if (lbl.indexOf("complet") !== -1 || lbl.indexOf("succes") !== -1)
			color = "#4285F4";

		if (
			lbl.indexOf("err") !== -1 ||
			lbl.indexOf("fail") !== -1 ||
			lbl.indexOf("damag") !== -1 ||
			lbl.indexOf("deni") !== -1 ||
			lbl.indexOf("reject") !== -1 ||
			lbl.indexOf("block") !== -1 ||
			lbl.indexOf("delet") !== -1
		)
			color = "#EA3568";

		if (
			lbl.indexOf("pendi") !== -1 ||
			lbl.indexOf("wait") !== -1 ||
			lbl.indexOf("norma") !== -1 ||
			lbl.indexOf("creat") !== -1
		)
			color = "#7b7e91";
	}

	return (
		<HBox
			center
			sx={{
				backgroundColor: color,
				padding: "7px 20px",
				borderRadius: "20px",
			}}
		>
			<Typo
				sx={{ textTransform: "capitalize", fontSize: "11px" }}
				variant="medium"
				color={
					isLightColor(color)
						? "rgba(0,0,0,.9)"
						: "rgba(255,255,255,.9)"
				}
			>
				{label}
			</Typo>
		</HBox>
	);
};
