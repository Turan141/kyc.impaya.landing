import { useState, useRef } from 'react';
import { VBox, HBox, Box } from '@ui/box/Box';
import { Typo } from '@ui/text/Typo';
import Button from '@ui/button/Button';
import Spacer from '@ui/spacer/Spacer';
import { Spinner } from '@ui/spinner/Spinner';
import { IconDocument, IconCamera, IconClose } from '@ui/icons';
import { useSession } from '@contexts/index';
import { useTranslation } from 'react-i18next';
import { useDialog } from '@contexts/DialogContext';
import { AppPage } from '../../App';
import { flipImage } from 'src/utils';
import { useAction, useAtom } from '@reatom/npm-react';
import { initStreamAction, isLoadingAtom, releaseCameraAction, streamErrorAtom, takePhotoAction, videoAtom } from 'src/models/Camera';
import { fmErrorAtom } from 'src/models/FaceMesh';
import { atom } from '@reatom/core';

interface UtilityBillPageProps {
	onNavigate: (page: AppPage) => void;
}

const addressAtom = atom<null | Record<string, any>>(null, 'utilityAddress');

export const UtilityBillComponent = ({ onNavigate }: UtilityBillPageProps) => {
	const { t } = useTranslation();
	const { showDialog } = useDialog();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [, setVideoRef] = useAtom(videoAtom);
	const [isLoadingStream] = useAtom(isLoadingAtom);
	const [streamError] = useAtom(streamErrorAtom);
	const [fmError] = useAtom(fmErrorAtom);

	const takePhoto = useAction(takePhotoAction);
	const releaseCamera = useAction(releaseCameraAction);
	const initCamera = useAction(initStreamAction);

	const cameraLoading = isLoadingStream;
	const cameraError = streamError || fmError;

	const { sessionId, isLoading, error, verifyUtilityBill, confirmUtilityBill, clearError } = useSession();

	// States
	const [uploadMode, setUploadMode] = useState<'camera' | 'upload' | null>(null);
	const [processingBill, setProcessingBill] = useState(false);
	const [utilityAddress, setUtilityAddress] = useAtom(addressAtom);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;

		const file = e.target.files[0];
		setProcessingBill(true);
		clearError();

		try {
			const base64 = await fileToBase64(file);
			if (typeof base64 === 'string') {
				const result = await verifyUtilityBill(base64);
				handleVerificationResult(result);
			}
		} catch (err) {
			console.error('File upload error:', err);
		} finally {
			setProcessingBill(false);
		}
	};

	const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
		});
	};

	const handleTakePhoto = async () => {
		setProcessingBill(true);
		clearError();

		const photo = await takePhoto();
		if (photo) {
			try {
				const flippedPhoto = await flipImage(photo);
				const result = await verifyUtilityBill(flippedPhoto);
				handleVerificationResult(result);
			} catch (err) {
				console.error('Photo upload error:', err);
			} finally {
				setProcessingBill(false);
			}
		} else {
			setProcessingBill(false);
		}
	};

	const handleVerificationResult = async (result: any) => {
		if (result?.status === 'request.awaitconfirm') {
			if (result.sessionObject?.utilityCheck) {
				if (uploadMode === 'camera') {
					await releaseCamera();
				}
				setUtilityAddress(result.sessionObject.utilityCheck);
			}
		}
	};

	const handleConfirm = async (confirmed: boolean = true) => {
		setProcessingBill(true);
		try {
			const result = await confirmUtilityBill(confirmed);
			if (result?.data?.status === 'success' && confirmed) {
				onNavigate('result');
			} else {
				setUploadMode(null);
				clearError();
				setUtilityAddress(null);
			}
		} catch (err) {
			console.error('Confirmation error:', err);
			setUtilityAddress(null);
			setUploadMode(null);
		} finally {
			setProcessingBill(false);
		}
	};

	const handleCancel = async () => {
		const choice = await showDialog({
			title: t('verification'),
			content: t('cancel_verification_question'),
			buttons: [{ title: t('cancel_accept') }, { title: t('cancel_reject') }],
		});

		if (choice === 0) {
			if (uploadMode === 'camera') {
				await releaseCamera();
			}
			onNavigate('begin');
		}
	};

	const switchToCamera = async () => {
		clearError();
		setUploadMode('camera');
		initCamera('environment');
	};

	const switchToUpload = () => {
		clearError();
		setUploadMode('upload');
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	if (!sessionId) {
		onNavigate('begin');
		return null;
	}

	if (utilityAddress) {
		const addressInfo = utilityAddress;
		const addressLine1 = addressInfo.adress?.line1 || '';
		const addressLine2 = addressInfo.adress?.line2 || '';
		const apartment = addressInfo.adress?.apartment || '';
		const city = addressInfo.city || '';
		const zip = addressInfo.zip || '';
		const country = addressInfo.country || '';

		const formattedAddress = [addressLine1, addressLine2, apartment, `${city}, ${zip}`, country].filter((line) => line).join('\n');

		return (
			<VBox
				sx={{
					display: 'flex',
					width: '100%',
					overflowY: 'auto',
					flexGrow: 1,
				}}
			>
				<VBox
					sx={{
						flexGrow: 1,
						padding: '32px 16px',
						width: '100%',
						alignItems: 'center',
					}}
				>
					<Spacer grow minHeight="20px" />

					<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('confirm_your_address')}</Typo>

					<Spacer size="16px" />

					<Typo sx={{ fontSize: '16px', fontWeight: '500', textAlign: 'center' }}>{t('is_this_your_correct_address')}</Typo>

					<Spacer size="24px" />

					<VBox
						sx={{
							backgroundColor: '#FFFFFF',
							borderRadius: '24px',
							padding: '24px 16px',
							width: '100%',
						}}
					>
						<Typo
							sx={{
								fontSize: '16px',
								fontWeight: '500',
								whiteSpace: 'pre-line',
								lineHeight: '1.5',
							}}
						>
							{formattedAddress}
						</Typo>
					</VBox>

					<Spacer grow minHeight="32px" />

					{error && (
						<>
							<Typo sx={{ color: 'red', fontSize: '16px', textAlign: 'center' }}>{error}</Typo>
							<Spacer size="16px" />
						</>
					)}

					<HBox sx={{ width: '100%', gap: '16px' }}>
						<Button
							sx={{
								width: '100%',
							}}
							onClick={() => handleConfirm(false)}
							disabled={isLoading}
						>
							{t('not_correct')}
						</Button>
						<Button sx={{ width: '100%' }} onClick={() => handleConfirm(true)} disabled={isLoading}>
							{isLoading ? <Spinner size={30} /> : t('confirm')}
						</Button>
					</HBox>
				</VBox>
			</VBox>
		);
	}

	if (uploadMode === 'camera') {
		return (
			<Box
				sx={{
					position: 'relative',
					display: 'flex',
					width: '100%',
					backgroundColor: 'black',
					flexGrow: 1,
				}}
			>
				<video
					ref={setVideoRef}
					autoPlay
					playsInline
					muted
					// height is viewpoer - height of header
					style={{ width: '100%', height: 'calc(100svh - 78px)', objectFit: 'cover' }}
				/>

				<Box
					sx={{
						position: 'absolute',
						top: '20px',
						right: '20px',
						padding: '10px',
						cursor: 'pointer',
						zIndex: 3,
					}}
					onClick={handleCancel}
				>
					<IconClose />
				</Box>

				<VBox
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						padding: '20px',
						color: 'white',
						zIndex: 2,
					}}
				>
					<Spacer size="48px" />

					<Typo
						sx={{
							fontSize: '24px',
							fontWeight: '500',
							textAlign: 'center',
							backgroundColor: 'rgba(255,255,255,0.7)',
							color: 'rgba(20, 23, 31, 0.7)',
							padding: '6px 0',
							borderRadius: '6px',
							cursor: 'default',
							userSelect: 'none',
						}}
					>
						{t('take_photo_of_utility_bill')}
					</Typo>

					<Spacer size="10px" />

					<Typo
						sx={{
							fontSize: '16px',
							textAlign: 'center',
							backgroundColor: 'rgba(255,255,255,0.7)',
							color: 'rgba(20, 23, 31, 0.7)',
							padding: '6px 0',
							borderRadius: '6px',
							cursor: 'default',
							userSelect: 'none',
						}}
					>
						{t('make_sure_all_details_are_clearly_visible')}
					</Typo>

					{(error || cameraError) && (
						<>
							<Spacer size="16px" />
							<Typo
								sx={{
									color: 'red',
									fontSize: '16px',
									textAlign: 'center',
									background: 'rgba(0, 0,0, 0.6)',
									padding: '16px',
									borderRadius: '12px',
								}}
							>
								{error || cameraError}
							</Typo>
							<Spacer grow minHeight="16px" />
						</>
					)}

					<Spacer grow />

					<Button
						sx={{
							width: '100%',
							padding: '12px',
							backgroundColor: 'rgba(20, 23, 31, 1)',
							marginTop: 'auto',
						}}
						onClick={handleTakePhoto}
						disabled={cameraLoading || processingBill}
					>
						{processingBill ? <Spinner size={30} /> : t('take_photo')}
					</Button>

					<Button
						sx={{
							width: '100%',
							padding: '12px',
							backgroundColor: 'rgba(255, 255, 255, 0.2)',
							marginTop: '10px',
						}}
						onClick={async () => {
							clearError();
							await releaseCamera();
							setUploadMode(null);
						}}
					>
						{t('cancel')}
					</Button>

					<Spacer size="20px" />
				</VBox>

				{(cameraLoading || processingBill) && (
					<VBox
						center
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							zIndex: 20,
						}}
					>
						{cameraLoading && (
							<>
								<Spinner color="white" />
								<Spacer size="10px" />
								<Typo color="white">{t('initializing_camera')}</Typo>
							</>
						)}
					</VBox>
				)}
			</Box>
		);
	}

	return (
		<VBox
			sx={{
				display: 'flex',
				width: '100%',
				overflowY: 'auto',
				flexGrow: 1,
			}}
		>
			<VBox
				sx={{
					flexGrow: 1,
					padding: '32px 16px',
					width: '100%',
					alignItems: 'center',
				}}
			>
				{processingBill && (
					<VBox
						center
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							zIndex: 20,
						}}
					>
						<Spinner color="white" />
					</VBox>
				)}
				<Spacer grow minHeight="20px" />

				<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('verify_your_address')}</Typo>

				<Spacer size="24px" />

				<Typo sx={{ fontSize: '16px', fontWeight: '500', textAlign: 'center' }}>{t('please_provide_utility_bill')}</Typo>

				<Spacer size="24px" />

				<VBox
					sx={{
						backgroundColor: '#FFFFFF',
						borderRadius: '24px',
						paddingRight: '16px',
						paddingLeft: '16px',
						paddingTop: '24px',
						paddingBottom: '24px',
						width: '100%',
						gap: '24px',
					}}
				>
					<HBox sx={{ gap: '16px' }}>
						<div>
							<IconDocument />
						</div>
						<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>{t('utility_bill_requirements')}</Typo>
					</HBox>
				</VBox>

				<Spacer grow minHeight="32px" />

				{error && (
					<>
						<Typo sx={{ color: 'red', fontSize: '18px', textAlign: 'center' }}>{error}</Typo>
						<Spacer minHeight="16px" grow />
					</>
				)}

				<input
					type="file"
					ref={fileInputRef}
					style={{ display: 'none' }}
					accept="image/jpeg,image/png,image/jpg,application/pdf"
					onChange={handleFileChange}
				/>

				<VBox sx={{ width: '100%', gap: '16px' }}>
					<Button
						sx={{
							width: '100%',
							display: 'flex',
							gap: '8px',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onClick={switchToCamera}
						disabled={isLoading}
					>
						<IconCamera />
						{t('take_photo')}
					</Button>
					<Button
						sx={{
							width: '100%',
							display: 'flex',
							gap: '8px',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onClick={switchToUpload}
						disabled={isLoading}
					>
						{/* <IconUpload /> */}
						{t('upload_file')}
					</Button>
				</VBox>

				<Spacer size="20px" />
			</VBox>
		</VBox>
	);
};
