var routeTo = require('./basic');

module.exports = {
  /**
   * @param {Object} app
   * @param {contracts.urlMap} urlMap
   */
  setRouts: function(app, urlMap) {

    // Outside View
    app.get(urlMap.INDEX, routeTo.slash);
    app.get(urlMap.ROOT.HEADER, routeTo.header);
    app.get(urlMap.ROOT.INTRO, routeTo.intro);

    // Log IN and OUT
    app.get(urlMap.LOG.IN, routeTo.login);
    app.post(urlMap.LOG.IN, routeTo.login);
    app.get(urlMap.LOG.AUTO, routeTo.autoLogin);
    app.post(urlMap.LOG.AUTO, routeTo.autoLogin);
    app.post(urlMap.LOG.OUT, routeTo.logout);

    // Drawing
    app.get(urlMap.DRAW.CANVAS, routeTo.canvas);
    app.get(urlMap.DRAW.LEFT, routeTo.panLeft);
    app.get(urlMap.DRAW.RIGHT, routeTo.panRight);

    // Password Lost
    app.get(urlMap.PW.LOST, routeTo.lostPassword);
    app.post(urlMap.PW.LOST, routeTo.lostPassword);

    // Reset Password
    app.get(urlMap.PW.RESET, routeTo.resetPassword);
    app.post(urlMap.PW.RESET, routeTo.resetPassword);

    // Account Create
    app.get(urlMap.ACCOUNTS.CREATE, routeTo.signUp);
    app.post(urlMap.ACCOUNTS.CREATE, routeTo.signUp);

    // Account Delete
    app.get(urlMap.ACCOUNTS.EDIT_OR_DELETE, routeTo.deleteAccount);
    app.post(urlMap.ACCOUNTS.EDIT_OR_DELETE, routeTo.deleteAccount);

    // Pictures
    app.post(urlMap.PICS.CREATE, routeTo.createPic);
    app.get(urlMap.PICS.READ, routeTo.readPics);
    app.post(urlMap.PICS.UPDATE, routeTo.updatePic);
    app.delete(urlMap.PICS.DELETE + '/:SVG_ID', routeTo.deletePic);

    // Colors
    app.get(urlMap.PICS.COLORS, routeTo.readColors);

  }
};
