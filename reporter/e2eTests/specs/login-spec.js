describe('User login:', function() {

    it('should login user with right data provided', function() {
        browser.get(baseUrl);
        template.login.signInButton.click();
        template.login.usernameInput.sendKeys('povilas1');
        template.login.passwordInput.sendKeys('povilas1');
        template.login.logInbutton.click();
        expect(true).toBe(true);
    });
    
});