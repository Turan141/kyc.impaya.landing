declare interface IconClip {
	width?: number;
	height?: number;
	color?: string;
	opacity?: number;
}

type SessionStatus = 'ok' | 'invalid' | 'not_exists' | 'expired' | 'accepted' | 'accepted_bun_invalid' | 'declained' | 'canceled';
