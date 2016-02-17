var config = require("../../config.js");

//utility functions
browser.addCommand("acceptTerms", function () {
    return this.pause(500).waitUntil(function () {
        return this.isVisible('#updateofTerm button').then(function (visible) {
            if (visible) {
                return this.click('#updateofTerm button')
            } else {
                return true;
            }
        });
    })
});

browser.addCommand("login", function (username, password) {
    return this.acceptTerms()
        .setValue('#ctl00_MainContentArea_Login1_UserName', username)
        .setValue('#ctl00_MainContentArea_Login1_Password', password)
        .click('#ctl00_MainContentArea_Login1_LoginButton')

});

browser.addCommand("navigateTopMenu", function (index, desiredUrl) {
    return this.moveToObject('#MenuBar > li:nth-child(' + index + ')')
        .click('#MenuFlyout1 a[href*="' + desiredUrl + '"]')
});

browser.addCommand("selectCompanyInHierarchy", function(coid){
    return this.click('#ctl00_LeftContentArea_KMCNavigationPaneCtrl1_KMCTreeView > table[title="' + coid + '"]')
});

describe('reporting site testing', function () {
    it('should login', function () {
        return browser
            .url(config.baseurl + '/Login.aspx')
            .login(config.kmcusername, config.kmcpassword)
            .getTitle().should.eventually.be.equal('Home Page');
    });

    it('should open company manager', function () {
        return browser
            .navigateTopMenu(3, 'securedzone/administration/companymanager/admcompanymanager.aspx')
            .waitForVisible('#ctl00_MainContentArea_HierarchyOptionsWrapper');
    });
    
    it('should select ABC Corporation', function () {
        return browser
            .selectCompanyInHierarchy(638).pause(500)
            .waitForVisible('#ctl00_MainContentArea_HierarchyOptionsWrapper');
    });
    
    it('should modify company information', function(){
       return browser
       .click('#ctl00_MainContentArea_hlModifyInfo')
       .setValue('#ctl00_MainContentArea_tbxAddress1', '123 Automated Change Avenue')
       .click('#ctl00_MainContentArea_btnUpdate')
       .alertText().should.eventually.be.equal('Your update completed successfully!')
       .alertAccept()
    });
    
    it('should end the session', function* () {
        return browser.pause(500).end();
    });
});