import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { ColorVariant } from '../../types';

interface Props {
  size: number;
  color: ColorVariant;
}

/**
 * Procedurally drawn glasses so the product catalog needs zero binary
 * assets - swapping `color` re-renders instantly with the chosen frame hue.
 */
export function GlassesOverlay({ size, color }: Props) {
  const w = size;
  const h = size * 0.42;
  const lensR = h * 0.46;
  const cy = h / 2;
  const leftCx = w * 0.24;
  const rightCx = w * 0.76;

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Circle cx={leftCx} cy={cy} r={lensR} stroke={color.hex} strokeWidth={h * 0.09} fill={color.hex} fillOpacity={0.12} />
      <Circle cx={rightCx} cy={cy} r={lensR} stroke={color.hex} strokeWidth={h * 0.09} fill={color.hex} fillOpacity={0.12} />
      <Path
        d={`M ${leftCx + lensR - h * 0.05} ${cy - h * 0.08} Q ${w / 2} ${cy - h * 0.22} ${rightCx - lensR + h * 0.05} ${cy - h * 0.08}`}
        stroke={color.hex}
        strokeWidth={h * 0.08}
        fill="none"
        strokeLinecap="round"
      />
      <Line x1={leftCx - lensR} y1={cy - h * 0.02} x2={0} y2={cy - h * 0.14} stroke={color.hex} strokeWidth={h * 0.07} strokeLinecap="round" />
      <Line x1={rightCx + lensR} y1={cy - h * 0.02} x2={w} y2={cy - h * 0.14} stroke={color.hex} strokeWidth={h * 0.07} strokeLinecap="round" />
    </Svg>
  );
}
