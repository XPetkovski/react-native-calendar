import { Browser, ChainablePromiseElement } from 'webdriverio';

export abstract class BaseScreen {
    public driver: Browser;

    constructor(driver: Browser) {
        this.driver = driver;
    }

    async getByTestID(id: string): Promise<ChainablePromiseElement> {
        const selector = `~${id}`;
        const el = this.driver.$(selector);
        await el.waitForExist({ timeout: 10000 });
        return el;
    }

    public get profilePicture() { 
        return this.getByTestID('profile'); 
    }

    public get dialogConfirmButton() {
        return this.getByTestID('confirm');
    }

}