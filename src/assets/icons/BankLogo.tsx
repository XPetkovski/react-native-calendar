import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BankLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export const BankLogo: React.FC<BankLogoProps> = ({
  width = 80,
  height = 80,
  color = '#0052cc', // Matches your primary Quipu blue!
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2L2 7l1 2h18l1-2-10-5zM4 10h2v7H4zm5 0h2v7H9zm5 0h2v7h-2zm5 0h2v7h-2zM2 19h20v2H2z" />
    </Svg>
  );
};
