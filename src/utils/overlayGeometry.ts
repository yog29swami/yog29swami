import { FaceLandmarks, Product } from '../types';

export interface OutfitGeometry {
  /** Anchor point in displayed-image coordinates that the whole outfit layer is centered on. */
  origin: { x: number; y: number };
  /** Suggested initial rotation, in radians, taken from the detected head tilt. */
  rotation: number;
  /** Suggested item size(s) in displayed-image pixels. */
  glassesWidth: number;
  earringOffsetX: number;
  earringOffsetY: number;
  earringSize: number;
  necklaceWidth: number;
  necklaceOffsetY: number;
}

const DEG_TO_RAD = Math.PI / 180;

/**
 * Converts raw ML Kit landmarks (in original photo pixel space) into ready-to-render
 * placement hints for the current product's category, scaled into the coordinate
 * space of the displayed image. Falls back to sensible defaults centered on the
 * photo when no face was detected, so the user can still drag things into place.
 */
export function computeOutfitGeometry(
  landmarks: FaceLandmarks | null,
  category: Product['category'],
  displayWidth: number,
  displayHeight: number,
  photoWidth: number,
  photoHeight: number
): OutfitGeometry {
  const scale = displayWidth / photoWidth;

  if (!landmarks || !landmarks.leftEyePosition || !landmarks.rightEyePosition) {
    const fallbackFaceWidth = displayWidth * 0.45;
    return {
      origin: { x: displayWidth / 2, y: displayHeight * (category === 'necklace' ? 0.55 : 0.35) },
      rotation: 0,
      glassesWidth: fallbackFaceWidth,
      earringOffsetX: fallbackFaceWidth * 0.55,
      earringOffsetY: fallbackFaceWidth * 0.05,
      earringSize: fallbackFaceWidth * 0.28,
      necklaceWidth: fallbackFaceWidth * 1.8,
      necklaceOffsetY: 0,
    };
  }

  const left = landmarks.leftEyePosition;
  const right = landmarks.rightEyePosition;
  const interocular = Math.hypot(right.x - left.x, right.y - left.y) * scale;
  const rotation = -landmarks.rollAngle * DEG_TO_RAD;

  const eyeMidpoint = {
    x: ((left.x + right.x) / 2) * scale,
    y: ((left.y + right.y) / 2) * scale,
  };

  const bounds = landmarks.bounds;
  const faceWidth = bounds ? bounds.width * scale : interocular * 2.5;
  const faceBottom = bounds ? (bounds.y + bounds.height) * scale : eyeMidpoint.y + faceWidth;

  return {
    origin: category === 'necklace' ? { x: displayWidth / 2 + eyeMidpoint.x - displayWidth / 2, y: faceBottom } : eyeMidpoint,
    rotation,
    glassesWidth: interocular * 2.3,
    earringOffsetX: interocular * 1.15,
    earringOffsetY: interocular * 0.9,
    earringSize: interocular * 0.5,
    necklaceWidth: faceWidth * 1.9,
    necklaceOffsetY: 0,
  };
}
