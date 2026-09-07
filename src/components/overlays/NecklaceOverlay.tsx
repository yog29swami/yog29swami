import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { ColorVariant, Product } from '../../types';

interface Props {
  width: number;
  color: ColorVariant;
  variant: Product['id'];
}

export function NecklaceOverlay({ width, color, variant }: Props) {
  const height = width * 0.5;
  const gradId = `necklace-grad-${color.id}-${variant}`;
  const secondary = color.hexSecondary ?? color.hex;
  const dip = variant === 'n-choker' ? height * 0.35 : variant === 'n-pendant' ? height * 0.85 : height * 0.6;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={color.hex} />
          <Stop offset="0.5" stopColor={secondary} />
          <Stop offset="1" stopColor={color.hex} />
        </LinearGradient>
      </Defs>

      <Path
        d={`M 0 0 Q ${width / 2} ${dip} ${width} 0`}
        stroke={`url(#${gradId})`}
        strokeWidth={variant === 'n-choker' ? height * 0.14 : height * 0.06}
        fill="none"
        strokeLinecap="round"
      />

      {variant === 'n-pendant' && <Circle cx={width / 2} cy={dip - height * 0.02} r={height * 0.16} fill={`url(#${gradId})`} />}
    </Svg>
  );
}
