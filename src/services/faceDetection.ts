import FaceDetection from '@react-native-ml-kit/face-detection';
import { FaceLandmarks } from '../types';

/**
 * Runs on-device ML Kit face detection against a static photo (selfie or
 * gallery picture) and returns the landmarks we need to auto-place glasses,
 * earrings and necklaces. Returns null if no face was found.
 */
export async function detectFace(imageUri: string): Promise<FaceLandmarks | null> {
  const faces = await FaceDetection.detect(imageUri, {
    landmarkMode: 'all',
    classificationMode: 'all',
    performanceMode: 'accurate',
  });

  if (!faces || faces.length === 0) return null;

  const face = faces[0];
  const landmark = (type: keyof NonNullable<typeof face.landmarks>) => {
    const found = face.landmarks?.[type];
    return found ? { x: found.position.x, y: found.position.y } : null;
  };

  return {
    leftEyePosition: landmark('leftEye'),
    rightEyePosition: landmark('rightEye'),
    noseBasePosition: landmark('noseBase'),
    leftEarPosition: landmark('leftEar'),
    rightEarPosition: landmark('rightEar'),
    bounds: face.frame
      ? { x: face.frame.left, y: face.frame.top, width: face.frame.width, height: face.frame.height }
      : null,
    rollAngle: face.rotationZ ?? 0,
  };
}
