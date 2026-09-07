import React, { PropsWithChildren } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { OverlayTransform } from '../types';

interface Props {
  /** Static anchor point (e.g. between the eyes) that the draggable delta is applied on top of. */
  origin: { x: number; y: number };
  transform: OverlayTransform;
  onTransformChange: (transform: OverlayTransform) => void;
}

/**
 * Lets the user fine-tune where a try-on item sits with pan, pinch-to-scale
 * and two-finger rotate - useful whenever automatic face detection needs a
 * nudge to fit perfectly.
 */
// Reanimated shared values are mutated via `.value` by design (they live outside
// React's render cycle), which the react-hooks "immutability" rule can't model.
/* eslint-disable react-hooks/immutability */
export function DraggableOverlay({ origin, transform, onTransformChange, children }: PropsWithChildren<Props>) {
  const translateX = useSharedValue(transform.x);
  const translateY = useSharedValue(transform.y);
  const scale = useSharedValue(transform.scale);
  const rotation = useSharedValue(transform.rotation);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(1);
  const startRotation = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = transform.x;
    translateY.value = transform.y;
    scale.value = transform.scale;
    rotation.value = transform.rotation;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transform.x, transform.y, transform.scale, transform.rotation]);

  const commit = () => {
    onTransformChange({
      x: translateX.value,
      y: translateY.value,
      scale: scale.value,
      rotation: rotation.value,
    });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      runOnJS(commit)();
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.max(0.4, Math.min(3, startScale.value * e.scale));
    })
    .onEnd(() => {
      runOnJS(commit)();
    });

  const rotate = Gesture.Rotation()
    .onStart(() => {
      startRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      rotation.value = startRotation.value + e.rotation;
    })
    .onEnd(() => {
      runOnJS(commit)();
    });

  const composed = Gesture.Simultaneous(pan, pinch, rotate);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: origin.x,
    top: origin.y,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
}
