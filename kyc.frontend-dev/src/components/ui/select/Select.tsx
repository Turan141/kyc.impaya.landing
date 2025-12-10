import React, { useEffect, useState } from 'react';
import { Box } from '../box/Box';
import { Typo, TypoCaption } from '../text/Typo';
import styled, { keyframes } from 'styled-components';
import { s_subscribe, s_unsubscribe } from 'badmfck-signal';
import Spacer from '../spacer/Spacer';
import { InputBoxStyle, InputFontStyle } from '../input/Input';

export interface ISelectItemProps<T> {
	value: T | null;
	prompt?: boolean;
	selected?: boolean;
}

interface ISelectProps<T = any> {
	id?: string;
	sx?: React.CSSProperties;
	ignoreInput?: boolean;
	label?: string;
	name?: string;
	data?: Record<string, any>;
	value?: T;
	item?: React.ReactElement<ISelectItemProps<T>>;
	values?: T[];
	children?: React.ReactElement<ISelectItemProps<T>>;
	onChange?: (v: T) => void;
	sheetAlign?: 'right' | 'left';
	minSheetWidth?: string;
	sheetWidth?: string;
	simple?: boolean;
	bg?: string;
}

const animation = keyframes`
    0% {
      transform: translateY(-30px);
      opacity: .5;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
`;

const animationHide = keyframes`
    0% {
      transform: translateY(0px);
      opacity: 1;
    }

    100% {
      transform: translateY(-30px);
      opacity: 0;
    }

`;

const SelectDiv = styled.div<{ $sheetAlign?: string; $minSheetWidth?: string; $bg?: string; $sheetWidth?: string; $opened: boolean }>`
	position: absolute;
	border-radius: 0 0 4px 4px;
	overflow: auto;
	max-height: 30vh;
	//min-height: 90px;

	${(props) => (props.$sheetAlign === 'right' ? 'right:0' : 'left:0')};
	${(props) => (props.$minSheetWidth ? 'min-width:' + props.$minSheetWidth : '')};
	${(props) => (props.$sheetWidth ? 'width:' + props.$sheetWidth : 'width:100%')};
	${(props) => (props.$bg ? 'background-color:' + props.$sheetWidth : 'background-color:#FFFFFF')};
	${(props) => (props.$opened ? 'z-index:100001' : 'z-index:1000')};

	&[data-state='hide'] {
		animation: ${animationHide} 0.2s ease-out;
		transform: translateY(-30px);
		opacity: 0;
	}
	&[data-state='dispose'] {
		animation: ${animationHide} 0.2s ease-out;
		transform: translateY(-30px);
		opacity: 0;
		display: none;
	}
	&[data-state='show'] {
		animation: ${animation} 0.2s ease-out;
	}

	box-shadow: 0px 10px 30px rgba(52, 62, 88, 0.3);
`;

const getDisplayName = (value: any) => {
	let displayValue = value ? '???' : '---';

	if (typeof value === 'string' || typeof value === 'number') displayValue = value + '';

	if (typeof value === 'boolean') displayValue = value ? 'YES' : 'NO';

	if (typeof value === 'object') {
		if (value && value.hasOwnProperty('name')) displayValue = (value as any)['name'];
		if (value && value.hasOwnProperty('label')) displayValue = (value as any)['label'];
		else if (value && value.hasOwnProperty('title')) displayValue = (value as any)['title'];
		else if (value && value.hasOwnProperty('displayName')) displayValue = (value as any)['displayName'];
	}

	return displayValue;
};

/*return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};
*/

let tid = 0;
export const Select = <T,>({
	id,
	sx,
	simple,
	sheetAlign,
	bg,
	minSheetWidth,
	sheetWidth,
	label,
	name,
	data,
	item,
	values,
	onChange,
	value,
	children,
}: ISelectProps<T>) => {
	const [selectedValue, setValue] = useState<T | null>(data && name ? data[name] : (value ?? null));
	const [state, setState] = useState<'show' | 'hide' | 'dispose'>('dispose');
	const [_id] = useState<string>(id ? id : +new Date() + '' + Math.random() * 10000);

	const iconTsx: Record<string, any> = {};
	if (state == 'show') {
		iconTsx.transform = 'rotate(180deg)';
	}

	const hide = () => {
		clearTimeout(tid);
		setState('hide');
		tid = setTimeout(() => {
			setState('dispose');
		}, 200) as any;
	};

	const show = () => {
		clearTimeout(tid);
		setState('show');
	};

	useEffect(() => {
		setValue(value ?? null);
	}, [value]);

	useEffect(() => {
		const evt = (e: MouseEvent) => {
			let el = e.target as HTMLElement;
			let clickedInside = false;
			while (el) {
				if (el.id === _id) {
					clickedInside = true;
					break;
				}
				el = el.parentElement as HTMLElement;
			}

			if (!clickedInside) {
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				if (state === 'show') hide();
			}
		};

		if (state === 'show') window.addEventListener('mousedown', evt);

		const signalID = s_subscribe(() => {
			if (state === 'show') hide();
			else show();
		}, 'TOGGLE_SELECT_' + _id);

		return () => {
			window.removeEventListener('mousedown', evt);
			s_unsubscribe(signalID);
		};
	});

	const icon = !simple && (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				width: '40px',
				'&:hover>svg>path': {
					fill: '#5d6e97',
				},
				'&>svg': {
					pointerEvents: 'none',
					height: '24px',
					width: '24px',
				},
				transition: 'transform .3s',
				...iconTsx,
			}}
		>
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M17 9V11L12 16L7 11V9L12 14L17 9Z" fill="#000000CC" fillOpacity="1" />
			</svg>
		</Box>
	);

	const handleValueSelect = (v: T) => {
		if (name && data) data[name] = v;
		setValue(v);
		if (onChange) onChange(v);
		hide();
	};

	let itm = null;
	if (children) itm = children;
	if (!itm && item) itm = item;

	// find selected item
	let _selectedValue = null;
	if (values && selectedValue && typeof selectedValue !== 'object') {
		for (let i of values) {
			if (typeof i === 'object') {
				for (let j in i) {
					if (i[j] === selectedValue) {
						_selectedValue = i;
						break;
					}
				}
			}
		}
	}
	if (!_selectedValue) _selectedValue = selectedValue;

	const selected = itm ? React.cloneElement(itm, { value: _selectedValue, prompt: true }) : <SelectItem prompt value={_selectedValue} />;

	const s = state === 'dispose' ? 'hide' : state;
	return (
		<Box
			sx={{
				position: 'relative',
			}}
			id={_id}
			testid="select"
		>
			{label && (
				<>
					<TypoCaption block>{label}:</TypoCaption>
					<Spacer size="3px" />
				</>
			)}

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '1fr max-content',

					/*border:"1px solid rgba(127,116,116,.1)",
                boxSizing:"border-box",
                boxShadow:"0px 0px 20px rgba(0,0,0,.1)",*/

					...InputBoxStyle(false),

					borderRadius: state === 'show' ? '4px 4px 0 0' : '4px',
					cursor: 'pointer',
					overflow: 'hidden',
					position: 'relative',
					backgroundColor: bg ? bg : '#FFFFFF',
					transition: 'border .2s',

					'&:hover': {
						border: state === 'show' ? '1px solid transparent' : '1px solid #35539f',
						transition: 'border .2s',
					},

					...sx,
				}}
				onClick={(e) => {
					e!.preventDefault();
					e!.stopPropagation();
					if (state === 'show') hide();
					else show();
				}}
			>
				{selected}
				{icon}
			</Box>

			{state !== 'dispose' && (
				<SelectDiv
					$opened={s === 'show'}
					data-state={s}
					$bg={bg}
					$sheetAlign={sheetAlign}
					$sheetWidth={sheetWidth}
					$minSheetWidth={minSheetWidth}
				>
					{values &&
						values.map((v: T, index: number) => {
							const props = {
								value: v,
								selected: v === selectedValue,
							};

							if (typeof v === 'object' && typeof selectedValue !== 'object') {
								for (let i in v) {
									if (v[i] === selectedValue) {
										props.value = v;
										props.selected = true;
										break;
									}
								}
							}

							/*if(props.selected)
                return null;*/

							const i = item ? React.cloneElement(item, props) : <SelectItem {...props} />;
							return (
								<Box
									key={index}
									sx={{
										cursor: props.selected ? 'auto' : 'pointer',
										borderBottom: '1px solid rgba(0,0,0,.1)',
										'&:last-child': {
											borderBottom: 'none',
										},
									}}
									onClick={(e) => {
										e!.preventDefault();
										e!.stopPropagation();
										if (state !== 'show') return;
										handleValueSelect(v);
									}}
									testid={'select-item-' + index}
								>
									{i}
								</Box>
							);
						})}
				</SelectDiv>
			)}
		</Box>
	);
};

const SelectItem = <T,>({ value, prompt, selected }: ISelectItemProps<T>) => {
	let displayValue = getDisplayName(value);
	const tsx: Record<string, any> = {};
	if (!prompt) {
		tsx['&:hover'] = { backgroundColor: 'rgba(0,0,0,.1)' };
		(tsx.borderBottom = '1px solid rgba(0,0,0,.1)'), (tsx.transition = 'background-color .3s');
	}

	if (selected) {
		tsx.pointerEvents = 'none';
		tsx.backgroundColor = '#5d6e97';
		tsx.color = '#FFFFFF';
	}

	return (
		<Box
			sx={{
				...InputFontStyle(),
				...tsx,
			}}
		>
			<Typo>{displayValue}</Typo>
		</Box>
	);
};
