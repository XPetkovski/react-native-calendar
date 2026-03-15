import React from 'react';
import { MobilePhoneIcon } from '../assets/icons/MobilePhone';
import { ProfileIcon } from '../assets/icons/Profile';

interface IconProps {
  color: string;
  size: number;
}

export const renderDashboardIcon = ({ color, size }: IconProps) => (
  <MobilePhoneIcon color={color} size={size} />
);

export const renderProfileIcon = ({ color, size }: IconProps) => (
  <ProfileIcon color={color} size={size} />
);
