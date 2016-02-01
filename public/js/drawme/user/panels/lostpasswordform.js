goog.provide('app.user.panel.LostPassword');

goog.require('app.user.EventType');
goog.require('bad.ui.Form');
goog.require('bad.ui.button');

/**
 * The basic login form controller.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.LostPassword = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.LostPassword, bad.ui.Form);

app.user.panel.LostPassword.prototype.initDom = function() {
  bad.ui.button.makeButton('cancel', this,
    goog.bind(function() {
      this.clearAlerts();
      this.dispatchActionEvent(app.user.EventType.FORGOT_PW_CANCEL);
    }, this)
  );

  bad.ui.button.makeButton('submit', this,
    goog.bind(this.submitLostPasswordForm, this)
  );
};

app.user.panel.LostPassword.prototype.submitLostPasswordForm = function() {
  this.checkValidation();
  if (this.getForm().checkValidity()) {
    this.xMan.post(
      this.getUri(),
      this.getPostContentFromForm(this.getForm()),
      goog.bind(this.onSubmitLostPasswordForm, this)
    );
  }
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.user.panel.LostPassword.prototype.onSubmitLostPasswordForm = function(e) {
  var xhr = e.target;
  var data = xhr.getResponseJson();
  this.clearAlerts();
  if (xhr.isSuccess()) {
    var fields = this.getForm().elements;
    this.displaySuccess(fields['email'], data['message']);
    // TODO: We need a spinner here, and then display the success
    // as a new page...
  } else {
    this.displayErrors(data);
  }
};
