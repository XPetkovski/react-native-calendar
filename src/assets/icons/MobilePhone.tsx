import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export const MobilePhoneIcon = ({
  size = 24,
  style,
  color = '#000',
}: IconProps) => {
  return (
    <Svg width={size} height={size} style={style} viewBox="0 0 18 28">
      <Path
        fill={color}
        d="M25 4H11a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-6 26h-2v-2h2zm-8-4V6h14v20z"
        transform="translate(-9 -4)"
      />
    </Svg>
  );
};
