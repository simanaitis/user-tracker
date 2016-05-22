'use strict';
exports.model = function() {
    
    var login = {
        signInButton: element(by.css('[ng-click="vm.signIn()"]')),
        usernameInput: element(by.model('name')),
        passwordInput: element(by.model('password')),
        logInbutton: element(by.css("[ng-click=\"vm.signIn(name, password, remember)\"")),
        logOutButton: element(by.css("[ng-click=\"vm.signOut()\""))
    };

    return {
        login: login
    }
};