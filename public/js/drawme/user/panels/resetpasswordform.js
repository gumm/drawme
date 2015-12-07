goog.provide('app.user.panel.ResetPassword');

goog.require('app.user.EventType');
goog.require('app.user.panel.SignUp');
goog.require('contracts.urlMap');
goog.require('goog.Uri');
goog.require('goog.dom');

/**
 * A form for resetting the users password, before login.
 * This is typically called when a user requested a password reset via email.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {app.user.panel.SignUp}
 * @constructor
 */
app.user.panel.ResetPassword = function(id, opt_domHelper) {
  app.user.panel.SignUp.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.ResetPassword, app.user.panel.SignUp);

app.user.panel.ResetPassword.prototype.initDom = function() {
  var formContainer = goog.dom.removeNode(
    goog.dom.getElement('pwreset')
  );
  var panelWrapper = goog.dom.getElementByClass(
    'pan-wrapper', this.getTarget());
  goog.dom.append(/** @type (!Node) */ (panelWrapper), formContainer);

  app.user.panel.ResetPassword.superClass_.initDom.call(this);
};

app.user.panel.ResetPassword.prototype.onCancel = function() {
  window.open(contracts.urlMap.INDEX, '_self');
};

/**
 * @param {string} queryData The data that was submitted when resetting the,
 *      users password. It contains the password in clear text.
 * @param {goog.events.EventLike} e Event object.
 */
app.user.panel.ResetPassword.prototype.onSubmitSignUp = function(queryData, e) {

  var xhr = e.target;
  var data = xhr.getResponseJson();
  this.clearAlerts();

  if (xhr.isSuccess()) {
    this.xMan.post(
      new goog.Uri(contracts.urlMap.LOG.IN),
      queryData,
      goog.bind(this.loginCallback, this)
    );
  } else {
    this.displayErrors(data);
  }
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.user.panel.ResetPassword.prototype.loginCallback = function(e) {
  var xhr = e.target;
  var data = xhr.getResponseJson();
  this.clearAlerts();
  if (xhr.isSuccess()) {
    this.dispatchActionEvent(
      app.user.EventType.PW_RESET_SUCCESS, data.data);
  } else {
    this.displayErrors(data);
  }
};
