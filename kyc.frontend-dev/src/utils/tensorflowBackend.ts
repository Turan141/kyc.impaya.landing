import * as tf from '@tensorflow/tfjs-core';

export const BACKEND_NAME = 'webgl';

/**
 * Ensure WebGL backend is properly configured for TensorFlow.js
 * This function resets and re-registers the backend if needed.
 * Used by both FaceMesh and DocumentClassifier models.
 */
export async function ensureBackend(): Promise<void> {
	const ENGINE = tf.engine();

	if (!(BACKEND_NAME in ENGINE.registryFactory)) {
		throw new Error(`${BACKEND_NAME} backend is not registered.`);
	}

	if (BACKEND_NAME in ENGINE.registry) {
		const backendFactory = tf.findBackendFactory(BACKEND_NAME);
		if (backendFactory) {
			tf.removeBackend(BACKEND_NAME);
			tf.registerBackend(BACKEND_NAME, backendFactory);
		}
	}

	await tf.setBackend(BACKEND_NAME);
}
