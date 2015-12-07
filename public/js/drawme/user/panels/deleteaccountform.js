goog.provide('app.user.panel.DeleteAccount');

goog.require('app.user.EventType');
goog.require('bad.ui.Form');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.dom.forms');
goog.require('goog.uri.utils');

/**
 * A delete account confirmation form.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.DeleteAccount = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.DeleteAccount, bad.ui.Form);

app.user.panel.DeleteAccount.prototype.initDom = function() {
  bad.utils.makeButton(
    'but-cancel', this,
    goog.bind(this.cancel, this));

  bad.utils.makeButton(
    'remove-account-confirm', this,
    goog.bind(this.submitConfirmation, this)
  );
};

app.user.panel.DeleteAccount.prototype.cancel = function() {
  this.dispatchActionEvent(app.user.EventType.ACCOUNT_REMOVE_CANCELED);
};

app.user.panel.DeleteAccount.prototype.submitConfirmation = function() {
  var form = this.getForm();
  this.checkValidation();

  if (form.checkValidity()) {
    var content = goog.dom.forms.getFormDataMap(form).toObject();
    var queryData = goog.uri.utils.buildQueryDataFromMap(content);
    this.xMan.post(
      this.getUri(),
      this.getPostContentFromForm(form),
      goog.bind(this.onConfirmation, this, queryData)
    );
  }
};

/**
 * @param {string} queryData
 * @param {goog.events.EventLike} e Event object.
 */
app.user.panel.DeleteAccount.prototype.onConfirmation = function(queryData, e) {
  var xhr = e.target;
  this.clearAlerts();
  if (xhr.isSuccess()) {
    window.open(contracts.urlMap.INDEX, '_self');
  } else {
    var data = xhr.getResponseJson();
    this.displayErrors(data);
  }
};
