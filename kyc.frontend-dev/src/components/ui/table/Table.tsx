import React, {JSX} from "react";
import {useTheme} from "styled-components";
import {Box, isCSS} from "../box/Box";
import {Typo} from "../text/Typo";
import {ITheme} from "../theme/GlobalTheme";

// STYLES
export const getDefaultTableLightTheme = {
	cellBackground: "#FFFFFF",
	cellBackgroundHover: "rgb(249, 251, 255)",
	headerBackground: "#f5f5f5",
	cellBorderBottom: "1px solid rgba(0,0,0,.1)",
	cellBorderTop: "1px solid transparent",
};

export const getDefaultTableDarkTheme: typeof getDefaultTableLightTheme = {
	cellBackground: "rgba(0,0,0,0)",
	cellBackgroundHover: "rgba(0,0,0,.1)",
	headerBackground: "rgba(0,0,0,.4)",
	cellBorderBottom: "1px solid rgba(0,0,0,.6)",
	cellBorderTop: "1px solid rgba(255,255,255,.06)",
};

export interface IHeaderValue {
	value?: string | JSX.Element | null;
	sx?: React.CSSProperties;
	gridColumn?: string;
}

export interface ICellFactoryResult {
	content: string | JSX.Element | null;
	sx?: React.CSSProperties;
}
export interface ITableProps<T> {
	headers?: IHeaderValue[];
	data: T[];
	cellFactory?: (
		row: T,
		cell: any,
		index: number,
		key?: number,
		name?: string
	) => ICellFactoryResult;
	headerFactory?: (
		value: string | JSX.Element | null,
		index: number
	) => ICellFactoryResult;
	gridTemplateColumns?: string;
	headless?: boolean;
	sx?: React.CSSProperties;
	onRowClick?: (row: T, cell: any) => void;
	onHeadClick?: (value: string) => void;
	appendCells?: {
		gridColumn?: string;
		value: string;
		header?: string | JSX.Element | null;
	}[];
	ignore?: Array<keyof T>;
	order?: Array<keyof T>;
	scrollable?: boolean;
	direction?: "row" | "column";
}

export interface ICellProps {
	sx?: React.CSSProperties;
	children?: string | JSX.Element | null;
	onClick?: () => void;
}

export interface IHeaderProps {
	sx?: React.CSSProperties;
	children?: string | JSX.Element | null;
	onClick?: () => void;
}

const createHeader = (req: ITableProps<any>, h: IHeaderValue, i: number) => {
	let sx = h.sx ?? {};
	let renderValue;
	if (req.headerFactory) {
		const factoryResult = parseCellResult(
			req.headerFactory(h.value ?? null, i)
		);
		if (isCSS(factoryResult))
			sx = {...sx, ...(factoryResult as React.CSSProperties)};
		else renderValue = factoryResult as any;
	} else {
		const parsedValue = parseCellResult(h.value);
		if (isCSS(parsedValue)) sx = parsedValue as React.CSSProperties;
		else renderValue = parsedValue as any;
	}

	return (
		<DefaultTableHead
			onClick={() => {
				if (req.onHeadClick) req.onHeadClick(h.value as string);
			}}
			key={i}
			sx={{...h.sx, ...sx}}>
			{renderValue ?? h.value}
		</DefaultTableHead>
	);
};

const parseCellResult = (
	cellResult: any
): React.CSSProperties | string | JSX.Element | null => {
	if (!cellResult) return null;

	if (React.isValidElement(cellResult)) {
		return cellResult;
	}

	let renderValue = null;
	if (isCSS(cellResult)) return cellResult as React.CSSProperties;

	if (typeof cellResult === "object") {
		try {
			renderValue = JSON.stringify(cellResult);
		} catch (e) {
			renderValue = "object{}";
		}
	} else {
		renderValue = cellResult + "";
	}

	if (
		renderValue.indexOf("-") !== -1 &&
		renderValue.indexOf("T") !== -1 &&
		renderValue.indexOf(":") !== -1
	) {
		try {
			if (renderValue.indexOf("Z") !== -1)
				renderValue = new Date(cellResult).toLocaleString();
			else renderValue = new Date(cellResult).toLocaleString();

			if (renderValue.toLowerCase().indexOf("invalid") !== -1)
				renderValue = cellResult + "";
		} catch (e) {}
	}

	return renderValue;
};

export const Table = <T,>(req: ITableProps<T>) => {
	// handle if date is APIResponse date
	const theme = useTheme() as ITheme;
	const style = theme.table;

	let data = req.data;
	let headers = req.headers;
	let ignore: string[] | null = [];
	let ignoredCellsIndex: number[] = [];

	if (!headers || headers.length === 0) {
		if (Array.isArray(data) && data.length > 0) {
			headers = Object.keys((data as any)[0]).map(k => {
				return {value: k};
			});

			if (!req.ignore && req.order && req.data) {
				for (let i of headers) {
					if (
						i.value &&
						!req.order.includes(i.value as string as any)
					) {
						ignore.push(i.value as string);
					}
				}
			} else {
				ignore = null;
			}
		}
	}

	// if(req.ignore)
	//     ignore = req.ignore.map(i=>i.toLowerCase())

	if (ignore) {
		// clear empty headers
		let i = -1;
		headers = headers?.filter(h => {
			i++;
			if (h.value && typeof h.value === "string") {
				const compare = h.value.trim().toLowerCase();
				if (ignore && ignore.includes(compare as string)) {
					ignoredCellsIndex?.push(i);
					return false;
				}
			}
			return true;
		});
	}

	if (req.order && headers) {
		headers.sort((a, b) => {
			const indexA = req.order!.indexOf((a.value + "") as any);
			const indexB = req.order!.indexOf((b.value + "") as any);

			// Если оба элемента есть в orderArray, сортируем по их индексу
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB;
			}

			// Если только один элемент есть в orderArray, он идет первым
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;

			// Если ни одного элемента нет в orderArray, сортируем их между собой
			return 0; //a.localeCompare(b);
		});
	}

	if (req.appendCells)
		headers = [
			...(headers ?? []),
			...req.appendCells.map(c => {
				return {value: c.header, gridColumn: c.gridColumn};
			}),
		];

	let gridTemplateColumns = headers
		?.map(h => {
			return h.gridColumn ? h.gridColumn : "auto";
		})
		.join(" ");
	if (req.direction === "column") gridTemplateColumns = "max-content 1fr";

	if (req.gridTemplateColumns) gridTemplateColumns = req.gridTemplateColumns;

	let counter = 0;
	let m = -1;

	const content = (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns,
				rowGap: "0px",

				...req.sx,
			}}>
			{!req.headless &&
				req.direction !== "column" &&
				headers &&
				headers.map((h, i) => {
					return createHeader(req, h, i);
				})}

			{data &&
				data.length &&
				data.map((row: any) => {
					let value = [row];
					if (typeof row === "object") {
						value = [];

						if (req.order) {
							for (let i of req.order) {
								if (
									ignore &&
									ignore.includes((i as string).toLowerCase())
								)
									continue;
								value.push(row[i]);
							}

							for (let i in row) {
								if (req.order.includes(i as any)) continue;
								if (ignore && ignore.includes(i.toLowerCase()))
									continue;
								value.push(row[i]);
							}
						} else {
							for (let key in row) {
								if (
									ignore &&
									ignore.includes(key.toLowerCase())
								)
									continue;
								value.push(row[key]);
							}
						}

						if (
							req.direction === "column" &&
							headers &&
							!req.headless
						) {
							value = value.flatMap((el, index) => [
								headers[index],
								el,
							]);
						}
					}

					if (req.appendCells) {
						value = [
							...value,
							...req.appendCells.map(c => c.value),
						];
					}

					return (
						<>
							{" "}
							<Box
								key={m--}
								sx={{
									display: "contents",
									cursor: req.onRowClick
										? "pointer"
										: "default",
									"&>div": {
										transition: "background-color 0.2s",
									},
									"&>div:nth-child(1)": {
										//borderRadius:"6px 0px 0px 6px",
									},
									"&>div:last-child": {
										//borderRadius:"0px 6px 6px 0px",
									},
									"&:hover > div": {
										backgroundColor:
											req.direction !== "column"
												? style?.cellBackgroundHover
												: undefined,
									},
								}}>
								{value.map((value, _cellIndex) => {
									if (
										req.direction === "column" &&
										headers &&
										!req.headless
									) {
										if (_cellIndex % 2 === 0)
											return createHeader(
												req,
												value as IHeaderValue,
												m--
											);
									}

									let sx = {};
									let renderValue;
									if (req.cellFactory) {
										let name = headers?.[_cellIndex]
											?.value as string;
										const factoryResult = req.cellFactory(
											row,
											value,
											_cellIndex,
											counter++,
											name
										);
										if (factoryResult.sx)
											sx = factoryResult.sx;
										if (factoryResult.content) {
											renderValue = parseCellResult(
												factoryResult.content
											);
										} else
											renderValue =
												parseCellResult(value);
									} else {
										const parsedValue =
											parseCellResult(value);
										if (isCSS(parsedValue))
											sx =
												parsedValue as React.CSSProperties;
										else renderValue = parsedValue as any;
									}

									return (
										<DefaultTableCell
											sx={sx}
											onClick={() => {
												if (req.onRowClick)
													req.onRowClick(row, value);
											}}
											key={"tc_" + counter++}>
											{renderValue ?? value}
										</DefaultTableCell>
									);
								})}
							</Box>
						</>
					);
				})}
		</Box>
	);

	if (req.scrollable) {
		return (
			<Box
				sx={{
					flexGrow: 1,
					overflow: "auto",
				}}>
				{content}
			</Box>
		);
	}

	return content;
};

const DefaultTableHead = (req: IHeaderProps) => {
	const theme = useTheme() as ITheme;
	let styled =
		theme.table ??
		(theme.name === "light"
			? getDefaultTableLightTheme
			: getDefaultTableDarkTheme);
	const content =
		typeof req.children !== "object" ? (
			<Typo
				variant="caption"
				sx={{textTransform: "uppercase", fontWeight: "600"}}>
				{req.children
					?.replaceAll("_", " ")
					.replace("ctime", "created at")}
			</Typo>
		) : (
			req.children
		);

	return (
		<Box
			onClick={req.onClick}
			sx={{
				padding: "12px 20px",
				backgroundColor: styled.headerBackground,
				whiteSpace: "nowrap",
				overflow: "hidden",
				textOverflow: "ellipsis",
				alignContent: "center",
				...req.sx,
			}}>
			{content}
		</Box>
	);
};

const DefaultTableCell = (req: ICellProps) => {
	const theme = useTheme() as ITheme;
	let style =
		theme.table ??
		(theme.name === "light"
			? getDefaultTableLightTheme
			: getDefaultTableDarkTheme);

	const content =
		typeof req.children !== "object" ? (
			<Typo variant="medium">{req.children}</Typo>
		) : (
			req.children
		);

	return (
		<Box
			onClick={req.onClick}
			sx={{
				padding: "16px",
				backgroundColor: style.cellBackground,
				borderBottom: style.cellBorderBottom,
				borderTop: style.cellBorderTop,
				alignContent: "center",
				overflow: "hidden",
				textOverflow: "ellipsis",
				...req.sx,
			}}>
			{content}
		</Box>
	);
};
