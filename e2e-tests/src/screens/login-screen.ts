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

    async login(emailValue: string, passwordValue: string) {
        await (await this.emailField).setValue(emailValue);
        await (await this.passwordField).setValue(passwordValue);
        await (await this.signInButton).click();
        // const password = await this.passwordField;
        // await password.setValue(passwordValue);
    }
}