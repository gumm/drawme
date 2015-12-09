goog.provide('app.user.view.Account');

goog.require('app.base.ViewEventType');
goog.require('app.user.EventType');
goog.require('app.user.panel.DeleteAccount');
goog.require('bad.ui.View');
goog.require('bad.ui.ViewEvent');
goog.require('contracts.urlMap');
goog.require('goog.Uri');

/**
 * @extends {bad.ui.View}
 * @constructor
 */
app.user.view.Account = function() {
  bad.ui.View.call(this);

};
goog.inherits(app.user.view.Account, bad.ui.View);

app.user.view.Account.prototype.displayPanels = function() {

  this.enterSignUpForm();
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.user.view.Account.prototype.onPanelAction = function(e) {

  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case app.user.EventType.SIGNUP_CANCEL:
      this.goHome();
      break;
    case app.user.EventType.SIGNUP_SUCCESS:
      this.displayPanels();
      break;
    case app.user.EventType.ACCOUNT_REMOVE_CANCELED:
      this.goHome();
      break;
    default:
      goog.nullFunction();
  }
};

//------------------------------------------------------------[ Sign-Up Form ]--

/**
 * The sign-up form is used for sign-up, editing accounts, and passwords.
 * It is destroyed on exit, and is thus recreated here each time it is called.
 */
app.user.view.Account.prototype.enterSignUpForm = function() {

  var urlString = contracts.urlMap.ACCOUNTS.EDIT_OR_DELETE;

  var form = new app.user.panel.DeleteAccount('confaccdel-form');
  form.setUri(new goog.Uri(urlString));
  form.setUser(this.getUser());
  form.setNestAsTarget(this.getLayout().getNest('main', 'center'));
  this.addPanelToView('replace', form);
  form.renderWithTemplate();
};

app.user.view.Account.prototype.goHome = function() {
  this.dispatchEvent(new bad.ui.ViewEvent(
      app.base.ViewEventType.VIEW_HOME, this
  ));
};
