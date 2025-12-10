import {useEffect, useRef, useState} from "react";
import {Badge} from "../badge/Badge";
import {Box, VBox} from "../box/Box";
import Button from "../button/Button";
import {IconVDots} from "../icons/IconVDots";
import {TitledValue} from "../rowItem/TitledValue";
import {TypoMedium} from "../text/Typo";
import {ICellFactoryResult, Table} from "./Table";

export const Rows = <T,>({
	data,
	order,
	gridTemplateColumns,
	onClick,
	cellFactory,
	menu,
	onMenuClick,
}: {
	data: T[];
	order?: (keyof T)[];
	gridTemplateColumns?: string;
	onClick?: (row: T, cell?: any) => void;
	cellFactory?: (
		row: T,
		cell: any,
		index: number,
		key?: number,
		name?: string,
		sx?: React.CSSProperties
	) => ICellFactoryResult;
	menu?: {title: string; id: string}[];
	onMenuClick?: (id: string, row: T) => void;
}) => {
	const [menuState, setMenu] = useState<{rect: any; row: T} | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const hm = (e: any) => {
			if (e.key === "Escape") {
				setMenu(null);
			}
		};
		const hm2 = () => {
			setMenu(null);
		};

		if (menuState) {
			window.addEventListener("keydown", hm);
			window.addEventListener("mousedown", hm2);
		} else {
			window.removeEventListener("click", hm);
			window.removeEventListener("mousedown", hm2);
		}
		return () => {
			window.removeEventListener("click", hm);
			window.removeEventListener("mousedown", hm2);
		};
	}, [menuState]);

	if (!data || !data.length) return null;

	if (menu === undefined) {
		menu = [
			{
				title: "View",
				id: "view",
			},
			{
				title: "Delete",
				id: "delete",
			},
		];
	}

	let gtc = gridTemplateColumns;

	if (!gtc) {
		// key counts
		let m = 0;
		// for (let i in data[0]) m++;
		if (order) m = order.length;

		gtc = "max-content 1fr";
		if (m > 2) gtc += " repeat(" + (m - 1) + ",max-content)";
	}

	const showMenu = (rect: any, row: T) => {
		setMenu({rect: rect, row: row});
	};

	return (
		<Box
			ref={ref}
			sx={{
				position: "relative",
			}}>
			<Table<T>
				sx={{
					rowGap: "4px",
				}}
				headless
				data={data}
				order={order}
				gridTemplateColumns={gtc}
				onRowClick={(row, cell) => {
					if (onClick) onClick(row, cell);
				}}
				appendCells={[{value: "__actions"}]}
				cellFactory={(row, cell, index: number, key, name) => {
					let radius = "";

					if (index === 0) radius = "6px 0 0 6px";

					const sx = {
						borderRadius: radius,
						padding: "10px",
						//	border: "1px solid red",
					};

					if (cell !== "__actions")
						sx.padding = "10px 40px 10px 20px";
					if (index === 0) sx.padding = "10px 0px 10px 20px";
					if (cell === "__actions") sx.padding = "10px 5px";

					if (cellFactory) {
						const cfr = cellFactory(
							row,
							cell,
							index,
							key,
							name,
							sx
						);
						if (typeof cfr.content === "object" || cfr.sx)
							return cfr;
					}

					if (name === "status") {
						return {
							content: <Badge key={key} label={cell} />,
							sx: sx,
						};
					}

					if (!name && cell === "__actions") {
						return {
							content: (
								<Button
									variant="icon"
									onClick={e => {
										setMenu(null);
										showMenu(
											e.target.getBoundingClientRect(),
											row
										);
									}}
									icon={<IconVDots />}
								/>
							),
							sx: {
								...sx,
								borderRadius: "0 6px 6px 0",
							},
						};
					}

					return {
						content: (
							<TitledValue title={name ?? "--"} value={cell} />
						),
						sx: {
							...sx,
							//padding: "10px 30px",
						},
					};
				}}
			/>

			{menuState && (
				<VBox
					sx={{
						position: "absolute",
						top:
							menuState.rect.top -
							(ref?.current?.getBoundingClientRect().top ?? 0) +
							"px",
						right: "20px",
						zIndex: 1,
						padding: "15px 20px",
						backgroundColor: "#555767",
						borderRadius: "6px",
						color: "buttonTextPrimary",
						gap: "10px",
						cursor: "pointer",
						boxShadow: "0 0 20px rgba(0,0,0,.1)",
					}}>
					{menu.map((m, i) => (
						<TypoMedium
							key={i}
							onClick={() => {
								if (onMenuClick)
									onMenuClick(m.id, menuState.row);
								setMenu(null);
							}}>
							{m.title}
						</TypoMedium>
					))}
				</VBox>
			)}
		</Box>
	);
};
