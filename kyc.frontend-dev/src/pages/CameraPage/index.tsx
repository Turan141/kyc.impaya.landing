import { useSession } from '@contexts/SessionContext';
import { useAction, useAtom } from '@reatom/npm-react';
import { useEffect, useState } from 'react';
import { DocumentCameraComponent } from 'src/components/DocumentFrame';
import { LivenessComponent } from 'src/components/FaceMeshCanvas';
import { UtilityBillComponent } from 'src/components/UtilityBill';
import { cameraModeAtom, releaseCameraAction, switchCameraMode, videoAtom } from 'src/models/Camera';
import { AppPage } from '../../App';

interface CameraPageProps {
	onNavigate: (page: AppPage) => void;
}

export function CameraPage({ onNavigate }: CameraPageProps) {
	const [pageLoading, setPageLoading] = useState(true);
	const { sessionId, currentStep } = useSession();
	const [videoRef] = useAtom(videoAtom);
	const [cameraMode] = useAtom(cameraModeAtom);
	const setCameraMode = useAction(switchCameraMode);
	const releaseCamera = useAction(releaseCameraAction);

	useEffect(
		() => () => {
			releaseCamera();
		},
		[],
	);

	useEffect(() => {
		if (!sessionId) {
			onNavigate('begin');
			return;
		}

		setPageLoading(false);
	}, [sessionId]);

	useEffect(() => {
		// if (!videoRef) return;
		if (currentStep === 'liveness') {
			setCameraMode('liveness');
		} else if (currentStep === 'utility-check') {
			setCameraMode('utility');
		} else {
			setCameraMode('document');
		}
		if (pageLoading) setPageLoading(false);
	}, [currentStep, videoRef]);

	if (pageLoading) return null;

	if (cameraMode === 'utility') {
		return <UtilityBillComponent onNavigate={onNavigate} />;
	}

	if (cameraMode === 'liveness') {
		return <LivenessComponent onNavigate={onNavigate} />;
	}

	return <DocumentCameraComponent onNavigate={onNavigate} />;
}
