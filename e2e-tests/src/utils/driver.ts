import { remote } from 'webdriverio';

export async function getDriver() {
    return await remote({
        hostname: '127.0.0.1',
        port: 4723,
        logLevel: 'info',
        capabilities: {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:udid': 'localhost:5555',
            'appium:noReset': true,
            'appium:ensureWebviewsHavePages': true,
            'appium:nativeWebScreenshot': true,
            'appium:newCommandTimeout': 3600,
            'appium:connectHardwareKeyboard': true
        }
    });
}