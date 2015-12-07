var routeTo = require('./basic');

module.exports = {
  /**
   * @param {contracts.urlMap} urlMap
   */
  setRouts: function(app, urlMap) {

    // Outside View
    app.get(urlMap.INDEX, routeTo.slash);
    app.get(urlMap.ROOT.HEADER, routeTo.header);
    app.get(urlMap.ROOT.INTRO, routeTo.intro);

    // LOG IN and OUT
    app.get(urlMap.LOG.IN, routeTo.login);
    app.post(urlMap.LOG.IN, routeTo.login);
    app.get(urlMap.LOG.AUTO, routeTo.autoLogin);
    app.post(urlMap.LOG.AUTO, routeTo.autoLogin);
    app.post(urlMap.LOG.OUT, routeTo.logout);

    // HOME
    app.get(urlMap.ROOT.HOME, routeTo.home);

    // Password Lost
    app.get(urlMap.PW.LOST, routeTo.lostPassword);
    app.post(urlMap.PW.LOST, routeTo.lostPassword);

    // Reset Password
    app.get(urlMap.PW.RESET, routeTo.resetPassword);
    app.post(urlMap.PW.RESET, routeTo.resetPassword);

    //// Password Editing
    //app.get(urlMap.PW.EDIT, routeTo.editPassword);
    //app.post(urlMap.PW.EDIT, routeTo.editPassword);


    // Account Create
    app.get(urlMap.ACCOUNTS.CREATE, routeTo.signUp);
    app.post(urlMap.ACCOUNTS.CREATE, routeTo.signUp);

    // Account Delete
    app.get(urlMap.ACCOUNTS.EDIT_OR_DELETE, routeTo.deleteAccount);
    app.post(urlMap.ACCOUNTS.EDIT_OR_DELETE, routeTo.deleteAccount);

  }
};
