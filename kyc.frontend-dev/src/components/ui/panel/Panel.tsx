import Button from "../button/Button";
import { Box } from "../box/Box";
import { Spinner } from "../spinner/Spinner";
import { Typo, TypoSmall } from "../text/Typo";
import { IconClose } from "../icons/IconClose";

interface IPanelProps {
	children?: any;
	scrollable?: boolean;
	decorator?: "absolute";
	busy?: boolean;
	label?: string;
	sx?: React.CSSProperties;
	onClose?: () => void;
}

const Panel = ({
	children,
	onClose,
	label,
	scrollable,
	decorator,
	busy,
	sx,
}: IPanelProps) => {

	if (decorator === "absolute" && scrollable) {
		children = (
			<Box
				sx={{
					display: decorator === "absolute" ? "flex" : undefined,
					flexDirection:
						decorator === "absolute" ? "column" : undefined,
					maxHeight: decorator === "absolute" ? "80vh" : undefined,
					zIndex: decorator === "absolute" ? 100 : undefined,
					overflow: "auto",
				}}
			>
				{children}
			</Box>
		);
	}

	const childrenContent = label ? (
		<Box
			sx={{
				padding: "30px",
				boxSizing: "border-box",
				overflow: "auto",
				flexGrow: 1,
			}}
		>
			{children}
		</Box>
	) : (
		children
	);

	const content = (
		<Box
			sx={{
				border: "1px solid rgba(255, 255, 255, 0.05)",
				padding: !label ? "30px" : undefined,
				borderRadius: "6px",
				boxShadow: "0px 0px 100px rgba(0,0,0,.1)",
				pointerEvents: busy ? "none" : "auto",
				userSelect: busy ? "none" : "auto",
				display: "flex",
				position: "relative",
				flexDirection: "column",
				backgroundColor: "panelBackgroundPrimary",
				...sx,
			}}
		>
			{busy && (
				<Box
					sx={{
						position: "absolute",
						top: "0px",
						left: "0px",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(255,255,255,.5)",
						zIndex: 100000,
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Spinner color="#ad1bf1" />
					<TypoSmall>Please wait...</TypoSmall>
				</Box>
			)}

			{label && (
				<>
					<Box
						sx={{
							backgroundColor:
								decorator === "absolute"
									? "panelHeadBackgroundColor"
									: undefined,
							padding: "20px",
							boxSizing: "border-box",
							// borderBottom:"1px solid rgba(0, 0, 0, 0.3)",
						}}
					>
						<Typo
							variant="head"
							sx={{
								fontWeight:
									decorator === "absolute" ? "200" : "500",
								fontSize:
									decorator === "absolute"
										? "1.4rem"
										: "1.2rem",
							}}
						>
							{label}
						</Typo>
					</Box>
					<Box
						sx={{
							boxSizing: "border-box",
							background: "panelDividerBackgroundColor",
							height: "2px",
							maxHeight: "2px",
						}}
					/>
				</>
			)}

			{onClose && (
				<Button
					icon={<IconClose />}
					sx={{ position: "absolute", top: "20px", right: "20px" }}
					onClick={onClose}
				/>
			)}

			{childrenContent}

			{busy && (
				<Box
					sx={{
						position: "absolute",
						top: "0px",
						left: "0px",
						width: "100%",
						height: "100%",
						backdropFilter: "saturate(0.2)",
						zIndex: 100001,
					}}
				/>
			)}
		</Box>
	);

	let panel = <>{content}</>;

	if (decorator === "absolute") {
		panel = (
			<Box
				sx={{
					position: "fixed",

					top: "0",
					left: "0",
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					zIndex: 100,
					backgroundColor: "rgba(0,0,0,.6)",
				}}
			>
				{content}
			</Box>
		);
	}

	return panel;
};

export default Panel;
