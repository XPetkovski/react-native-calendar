import AuthService from '../services/AuthService';
import SecureStoreService from '../services/SecureStoreService';
import { authenticateWithBiometrics } from '../services/biometricService';
import { isValidEmail } from '../utils/utils';

export class SignInController {
  public async loginWithEmail(
    email?: string,
    password?: string,
  ): Promise<void> {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }

    try {
      await AuthService.login(email, password);
      await SecureStoreService.saveCredentials(email, password);
    } catch (err: any) {
      throw new Error(err.message.replace('Firebase: ', ''));
    }
  }

  public async loginWithBiometrics(): Promise<void> {
    const bioCheck = await authenticateWithBiometrics();

    if (bioCheck.isNotSupported) {
      throw new Error('BIOMETRICS_NOT_SUPPORTED');
    }

    const credentials = await SecureStoreService.getStoredCredentials();

    if (!credentials) {
      throw new Error('Please sign in manually once to enable biometrics.');
    }

    try {
      await AuthService.login(credentials.email, credentials.password);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default new SignInController();
