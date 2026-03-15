// src/components/icons/ProfileIcon.tsx
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

// 1. Define the TypeScript interface for our props
interface ProfileIconProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

// 2. Apply the interface and set default values
export const ProfileIcon = ({
  size = 24,
  style,
  color = '#000',
}: ProfileIconProps) => {
  return (
    <Svg width={size} height={size} style={style} viewBox="0 0 29.055 33.374">
      <G
        fill="none"
        stroke={color} // 3. Use the dynamic color here!
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        transform="translate(-172.375 -12.417)"
      >
        <Path d="M200.18 44.542V40.87c0-4.056-2.972-7.344-6.639-7.344h-13.277c-3.667 0-6.639 3.288-6.639 7.344v3.672" />
        <Path d="M194.246 21.011a7.344 7.344 0 11-7.343-7.344 7.344 7.344 0 017.344 7.344z" />
      </G>
    </Svg>
  );
};
