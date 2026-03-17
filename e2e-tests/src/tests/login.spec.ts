import { Browser } from 'webdriverio';
import { LoginScreen } from '@screens/login-screen';
import { CalendarScreen } from '@screens/calendar-screen';
import { getDriver } from '@utils/driver';
import { expect } from 'expect-webdriverio'

describe("login suite", async () => {

    let driver: Browser;
    let loginScreen: LoginScreen;
    let calendarScreen: CalendarScreen
    
    beforeEach(async () => {
        driver = await getDriver();
        loginScreen = new LoginScreen(driver);
        calendarScreen = new CalendarScreen(driver);
    });

    it('should login with a valid user', async () => {
        try {
            await loginScreen.login('ilovetesting999@gmail.com', 'Test123!');
            await expect(driver.$('//*[@text="Your Schedule"]')).toBeDisplayed();
        } catch { throw new Error('Error')}
    });

    afterEach(async () => {
        await driver.deleteSession();
    });

})