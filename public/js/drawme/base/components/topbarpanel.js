goog.provide('app.base.TopBarPanel');

goog.require('app.base.EventType');
goog.require('bad.ui.Panel');
goog.require('bad.ui.button');
goog.require('contracts.urlMap');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.uri.utils');

/**
 * The basic login form controller.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.TopBarPanel = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);

};
goog.inherits(app.base.TopBarPanel, bad.ui.Panel);

app.base.TopBarPanel.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());
  this.initDom();
  app.base.TopBarPanel.superClass_.enterDocument.call(this);
};

app.base.TopBarPanel.prototype.initDom = function() {
  this.buildUserButton();
};

app.base.TopBarPanel.prototype.buildUserButton = function() {

  /**
   * @type {!Array}
   */
  var menuItems = [
    ['Delete Profile', 'icon-user', goog.bind(this.dispatchActionEvent,
      this, app.base.EventType.EDIT_PROFILE)],
    //['Drawings', 'icon-building', goog.bind(this.dispatchActionEvent,
    //  this, app.user.EventType.VIEW_PIC)],
    [/* menu separator */],
    ['Sign Out', 'icon-signout', goog.bind(this.logOut, this)]
  ];

  // Menu Button
  this.userButton = bad.ui.button.makeMenuButton(
      'user_button',      // elId
      menuItems,          // menuItems
      this.dom_,          // domHelper
      this.getHandler(),  // handler
      this,               // scope
      true,               // opt_sticky
      'flat_menu');       // opt_cssClass
};


/**
 * @param {!bad.UserManager} user
 */
app.base.TopBarPanel.prototype.setUser = function(user) {
  app.base.TopBarPanel.superClass_.setUser.call(this, user);
  this.updateUser();
};

app.base.TopBarPanel.prototype.updateUser = function() {
  var salutation = this.getUser().getSalutation();
  if (this.userButton) {
    var icon = goog.dom.createDom('i', 'icon-cog');
    this.userButton.setContent([icon, salutation]);
  }
};

app.base.TopBarPanel.prototype.logOut = function() {
  var uri = new goog.Uri(contracts.urlMap.LOG.OUT);
  var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
  this.xMan.post(uri, queryData, goog.bind(this.onLogOut, this));
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.TopBarPanel.prototype.onLogOut = function(e) {
  var xhr = e.target;
  if (xhr.isSuccess()) {
    window.open(contracts.urlMap.INDEX, '_self');
  } else {
    console.debug('Log Out was not successful. Try again...', e, xhr);
  }
};
