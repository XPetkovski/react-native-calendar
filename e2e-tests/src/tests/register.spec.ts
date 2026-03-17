import { Browser } from 'webdriverio';
import { LoginScreen } from '@screens/login-screen';
import { CalendarScreen } from '@screens/calendar-screen';
import { ProfileScreen } from '@screens/profile-screen';
import { getDriver } from '@utils/driver';
import { expect } from 'expect-webdriverio'

describe("register suite", async () => {

    let driver: Browser;
    let loginScreen: LoginScreen;
    let calendarScreen: CalendarScreen
    let profileScreen: ProfileScreen;
    let randomString: string;
    
    beforeEach(async () => {
        driver = await getDriver();
        loginScreen = new LoginScreen(driver);
        calendarScreen = new CalendarScreen(driver);
        profileScreen = new ProfileScreen(driver);
        randomString = Math.random().toString(36).substring(2, 8);;
    });

    it('should register', async () => {
        try {
            await loginScreen.register(`${randomString}@test.com`, 'Test123!');
            await expect(driver.$('//*[@text="Welcome to Quipu!"]')).toBeDisplayed();
        } catch { throw new Error('Error')}
    });

    afterEach(async () => {
        // await (await calendarScreen.profilePicture).click();
        // await profileScreen.logout();
        await driver.deleteSession();
    });

})