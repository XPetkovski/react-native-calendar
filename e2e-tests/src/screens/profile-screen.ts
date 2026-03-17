import BaseScreen from './base-screen';

export class ProfileScreen extends BaseScreen {
    
    public get logoutButton() { 
        return this.getByTestID('logout'); 
    }

    async logout() {
        await (await this.logoutButton).click();
        await (await this.dialogConfirmButton).click();
    }
    
}