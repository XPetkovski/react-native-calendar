// src/services/biometricService.ts
import ReactNativeBiometrics from 'react-native-biometrics';

interface BiometricResult {
  success: boolean;
  error?: string;
  isNotSupported?: boolean;
}

export const authenticateWithBiometrics =
  async (): Promise<BiometricResult> => {
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      // 1. Check if hardware is available
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        return { success: false, isNotSupported: true };
      }

      // 2. Trigger the prompt
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Log in to QuipuApp',
      });

      if (success) {
        return { success: true };
      } else {
        // User cancelled or failed
        return {
          success: false,
          error: 'Biometric authentication was cancelled or failed.',
        };
      }
    } catch (err) {
      console.error('[Biometrics Service]', err);
      return {
        success: false,
        error: 'Something went wrong with biometric authentication.',
      };
    }
  };
