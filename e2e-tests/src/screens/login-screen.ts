import BaseScreen from './base-screen';

export class LoginScreen extends BaseScreen {
    
    public get emailField() { 
        return this.getByTestID('email'); 
    }

    public get passwordField() { 
        return this.getByTestID('password'); 
    }

    public get signInButton() {
        return this.getByTestID('sign-in')
    }

    public get registerPageLink() {
        return this.getByTestID('register');
    }

    public get signUpButton() {
        return this.getByTestID('sign-up')
    }

    async register(email: string, password: string) {
        await (await this.registerPageLink).click();
        await (await this.emailField).setValue(email);
        await (await this.passwordField).setValue(password);
        await (await this.signUpButton).click();
    }

    async login(email: string, password: string) {
        await (await this.emailField).setValue(email);
        await (await this.passwordField).setValue(password);
        await (await this.signInButton).click();
    }
}