import styled from 'styled-components';

const Ver = styled.div`
	position: fixed;
	z-index: 10000;
	bottom: 10px;
	right: 10px;
	font-size: 10px;
	color: red;
	user-select: none;
	//pointer-events: none;
	&:hover {
		font-size: 24px;
	}
`;

const version = import.meta.env.VITE_APP_VERSION ?? '_';

export const Version = () => {
	return <Ver>ver.: {version}</Ver>;
};
