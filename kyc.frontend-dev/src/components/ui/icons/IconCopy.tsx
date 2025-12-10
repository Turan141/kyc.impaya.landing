export const IconCopy = ({size}: {size?: string}) => {
	if (!size) size = "16";
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M13 3H10L7 0H0V13H6V16H16V6L13 3ZM7 1L9 3H7V1ZM1 12V1H6V4H9V12H1ZM15 15H7V13H10V4H12V7H15V15ZM13 6V4L15 6H13Z"
				fill="#1C2E45"
				fillOpacity="0.6"
			/>
		</svg>
	);
};
