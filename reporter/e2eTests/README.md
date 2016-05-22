# AssetManagementUI E2E Tests

### When running the project for the first time:

1. Go to https://nodejs.org/ and click 'Install' to install Node.js (download newest version). **Don't download Node.exe**
2. `npm install gulp -g`
3. `npm install -g protractor`

**NOTE:**
If you get some problem with python run `npm install node-python` version should be 2.7

### To run the project:

1. Open command prompt in 'e2eTests' directory
2. Run `webdriver-manager update --standalone`
3. Run `webdriver-manager start`
4. Open other command prompt in 'e2eTests' directory
5. Run `npm install`
6. Run `gulp --username UiTests_user --password ***** --environment prod --browser ch`
7. Run `gulp --environment prod --browser ch` run tests as traffic user.

***NOTE***
Currently you can't run tests on IE browser in your local pc.

***NOTE***
If you want to run tests local in IE browser you need to make this changes
Got to -> http://elgalu.github.io/2014/run-protractor-against-internet-explorer-vm/ (Find: STEP 4)
Solve sendKeys problem in IE: https://github.com/angular/protractor/issues/1506 (Search for: dpaquette commented on Jun 25)
If you get some problem with security warnings popup try this:
http://www.technipages.com/ie-disable-the-current-web-page-is-trying-to-open-a-site-in-your-trusted-sites-list-do-you-want-to-allow-this-message
