import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { ColorVariant, Product } from '../../types';

interface Props {
  size: number;
  color: ColorVariant;
  variant: Product['id'];
}

export function EarringOverlay({ size, color, variant }: Props) {
  const gradId = `grad-${color.id}-${variant}`;
  const secondary = color.hexSecondary ?? color.hex;

  return (
    <Svg width={size} height={size * 1.6} viewBox={`0 0 ${size} ${size * 1.6}`}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color.hex} />
          <Stop offset="1" stopColor={secondary} />
        </LinearGradient>
      </Defs>

      {variant === 'e-hoop' && (
        <Path
          d={`M ${size / 2} ${size * 0.1} a ${size * 0.4} ${size * 0.65} 0 1 0 0.01 0`}
          stroke={`url(#${gradId})`}
          strokeWidth={size * 0.09}
          fill="none"
        />
      )}

      {variant === 'e-drop' && (
        <>
          <Circle cx={size / 2} cy={size * 0.18} r={size * 0.08} fill={`url(#${gradId})`} />
          <Path
            d={`M ${size / 2} ${size * 0.26} L ${size * 0.32} ${size * 0.8} Q ${size / 2} ${size * 1.05} ${size * 0.68} ${size * 0.8} Z`}
            fill={`url(#${gradId})`}
            opacity={0.9}
          />
        </>
      )}

      {variant === 'e-stud' && <Circle cx={size / 2} cy={size * 0.22} r={size * 0.16} fill={`url(#${gradId})`} />}
    </Svg>
  );
}
