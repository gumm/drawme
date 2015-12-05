var routeTo = require('./basic');

module.exports = {
  /**
   * @param {contracts.urlMap} urlMap
   */
  setRouts: function(app, urlMap) {

    /** BASICS */
    app.get(urlMap.INDEX, routeTo.slash);
    app.get(urlMap.ROOT.HEADER, routeTo.header);
    app.get(urlMap.ROOT.INTRO, routeTo.intro);
    app.get(urlMap.LOG.IN, routeTo.login);
    app.post(urlMap.LOG.IN, routeTo.login);
    app.get(urlMap.ROOT.HOME, routeTo.home);

    //------------------------------------------------------------[ Password ]--

    //// Password Management
    //app.get(urlMap.PW.LOST, routeTo.lostPassword);
    //app.post(urlMap.PW.LOST, routeTo.lostPassword);

    // Reset Password
    //app.get(urlMap.PW.RESET, routeTo.resetPassword);
    //app.post(urlMap.PW.RESET, routeTo.resetPassword);

    //// Password Editing
    //app.get(urlMap.PW.EDIT, routeTo.editPassword);
    //app.post(urlMap.PW.EDIT, routeTo.editPassword);

    //-------------------------------------------------------------[ Account ]--

    /** Create */
    app.get(urlMap.ACCOUNTS.CREATE, routeTo.signUp);
    app.post(urlMap.ACCOUNTS.CREATE, routeTo.signUp);

    ///** Read */
    //app.get(urlMap.ACCOUNTS.READ, routeTo.readProfile);
    //app.get(urlMap.ACCOUNTS.READ + '/:id', routeTo.readProfile);
    //
    ///** Update */
    //app.get(urlMap.ACCOUNTS.UPDATE, routeTo.editProfile);
    //app.post(urlMap.ACCOUNTS.UPDATE, routeTo.editProfile);
    //
    ///** Delete */
    //app.get(urlMap.ACCOUNTS.DELETE, routeTo.deleteAccount);
    //app.post(urlMap.ACCOUNTS.DELETE, routeTo.deleteAccount);



  }
};
