import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SignInScreen } from '../screens/SignInScreen.tsx';

// 1. Mock React Navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// 2. Mock Firebase/Auth Services
jest.mock('../services/AuthService', () => ({
  login: jest.fn(),
}));
jest.mock('../services/SecureStoreService', () => ({
  getStoredCredentials: jest.fn().mockResolvedValue(null),
}));
jest.mock('../services/biometricService', () => ({
  authenticateWithBiometrics: jest
    .fn()
    .mockResolvedValue({ isNotSupported: true }),
}));

describe('SignInScreen', () => {
  it('renders all the essential input fields and buttons', () => {
    const { getByPlaceholderText, getByText } = render(
      <SignInScreen navigation={{ navigate: mockNavigate }} />,
    );

    // Assert that the UI elements exist on the screen
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('Email address')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows an error if submitting empty fields', () => {
    const { getByText } = render(
      <SignInScreen navigation={{ navigate: mockNavigate }} />,
    );

    // Simulate pressing the Sign In button without typing anything
    // should fall and return error
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    // Assert that our validation error pops up
    expect(getByText('Please enter both email and password.')).toBeTruthy();
  });
});
