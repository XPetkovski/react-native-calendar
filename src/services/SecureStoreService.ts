// src/services/SecureStoreService.ts
import * as Keychain from 'react-native-keychain';

class SecureStoreService {
  // We use a constant service name to ensure we are always looking in the same vault
  private SERVICE_NAME = 'quipu_auth_vault';

  async saveCredentials(email: string, pass: string) {
    try {
      await Keychain.setGenericPassword(email, pass, {
        service: this.SERVICE_NAME,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      });
      console.log('Credentials safely vaulted for:', email);
    } catch (error) {
      console.error('Failed to save to vault:', error);
    }
  }

  async getStoredCredentials() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: this.SERVICE_NAME,
      });

      if (credentials) {
        console.log('🔓 Vault opened successfully for:', credentials.username);
        return { email: credentials.username, password: credentials.password };
      }

      console.log('Vault is currently empty.');
      return null;
    } catch (error) {
      console.error('Biometric verification failed or vault error:', error);
      return null;
    }
  }

  async clearCredentials() {
    await Keychain.resetGenericPassword({ service: this.SERVICE_NAME });
    console.log('Vault cleared.');
  }
}

export default new SecureStoreService();
