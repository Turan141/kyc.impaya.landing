import { useAtom } from '@reatom/npm-react';
import { FC, memo } from 'react';
import { isStreamActiveAtom, videoAtom } from 'src/models/Camera';
import { isInitializedAtom } from 'src/models/FaceMesh';

export const Video: FC = memo(() => {
	const [videoRef, setVideoRef] = useAtom(videoAtom);
	const [isInitialized] = useAtom(isInitializedAtom);
	const [isStreamActive] = useAtom(isStreamActiveAtom);

	return (
		<video
			ref={setVideoRef}
			data-is-initialized={isStreamActive && isInitialized}
			autoPlay
			playsInline
			width={videoRef?.videoWidth}
			height={videoRef?.videoHeight}
			muted
			style={{ display: 'none' }}
		/>
	);
});
