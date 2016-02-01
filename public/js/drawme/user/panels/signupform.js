goog.provide('app.user.panel.SignUp');

goog.require('app.user.EventType');
goog.require('bad.ui.Form');
goog.require('bad.ui.button');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.uri.utils');

/**
 * The basic login form controller.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.SignUp = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.SignUp, bad.ui.Form);

app.user.panel.SignUp.prototype.initDom = function() {

  bad.ui.button.makeButton('account-cancel', this,
    goog.bind(this.onCancel, this)
  );

  bad.ui.button.makeButton('account-submit', this,
    goog.bind(this.submitSignUp, this)
  );

  var removeAccount = goog.dom.getElement('remove-account');
  if (removeAccount) {
    bad.ui.button.makeButton('remove-account', this,
      goog.bind(this.dispatchActionEvent, this,
        app.user.EventType.ACCOUNT_REMOVE)
    );
  }


};

app.user.panel.SignUp.prototype.onCancel = function() {
  this.clearAlerts();
  this.dispatchActionEvent(app.user.EventType.SIGNUP_CANCEL);
};

app.user.panel.SignUp.prototype.submitSignUp = function() {
  this.checkPasswordMatch();
  this.checkValidation();

  var form = this.getForm();
  if (form.checkValidity()) {
    var content = goog.dom.forms.getFormDataMap(form).toObject();
    var queryData = goog.uri.utils.buildQueryDataFromMap(content);
    this.xMan.post(
      this.getUri(),
      this.getPostContentFromForm(form),
      goog.bind(this.onSubmitSignUp, this, queryData)
    );
  }
};

/**
 * Internally check that the passwords match.
 * @return {!boolean}
 */
app.user.panel.SignUp.prototype.checkPasswordMatch = function() {
  var password1 = document.getElementById('pass-tf');
  var password2 = document.getElementById('confpass-tf');
  if (password1 && password2) {
    if (password1.value !== password2.value) {
      password2.setCustomValidity('Passwords must match.');
      return false;
    } else {
      password2.setCustomValidity('');
      return true;
    }
  }
  return true;
};

/**
 * @param {string} queryData
 * @param {goog.events.EventLike} e Event object.
 */
app.user.panel.SignUp.prototype.onSubmitSignUp = function(queryData, e) {
  var xhr = e.target;
  var data = xhr.getResponseJson();
  this.clearAlerts();
  if (xhr.isSuccess()) {
    this.dispatchActionEvent(app.user.EventType.SIGNUP_SUCCESS,
      {query: queryData, reply: data}
    );
  } else {
    this.displayErrors(data);
  }
};
