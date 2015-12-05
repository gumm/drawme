goog.provide('app.base.panel.Persistent');

goog.require('app.base.EventType');
goog.require('app.user.EventType');
goog.require('bad.ui.MenuFloatRenderer');
goog.require('bad.ui.MenuItemRenderer');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.ui.Css3MenuButtonRenderer');
goog.require('goog.ui.MenuButton');
goog.require('goog.uri.utils');

/**
 * The basic login form controller.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Persistent = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);

};
goog.inherits(app.base.panel.Persistent, bad.ui.Panel);

app.base.panel.Persistent.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());
  this.initDom();
  app.base.panel.Persistent.superClass_.enterDocument.call(this);
};

app.base.panel.Persistent.prototype.initDom = function() {
  this.buildUserButton();
};

app.base.panel.Persistent.prototype.buildUserButton = function() {

  /**
   * @type {Array}
   */
  var menuItems = [
    ['Profile', 'icon-user', goog.bind(this.dispatchActionEvent,
      this, app.base.EventType.EDIT_PROFILE)],
    ['Drawings', 'icon-building', goog.bind(this.dispatchActionEvent,
      this, app.user.EventType.VIEW_ORG)],
    [/* menu separator */],
    ['Sign Out', 'icon-signout', goog.bind(this.logOut, this)]
  ];

  /**
   * @type {bad.ui.MenuFloatRenderer}
   */
  var renderer = bad.ui.MenuFloatRenderer.getInstance();

  /**
   * @type {bad.ui.MenuItemRenderer}
   */
  var itemRenderer = bad.ui.MenuItemRenderer.getInstance();

  var menu = bad.utils.makeMenu(
    menuItems, this.dom_, this.getHandler(), this, renderer, itemRenderer);

  // Menu Button
  var menuButton = new goog.ui.MenuButton('', menu,
    new goog.ui.Css3MenuButtonRenderer(), this.dom_
  );
  menuButton.decorate(goog.dom.getElement('user_button'));

  this.userButton = menuButton;
};

/**
 * @param {Object} user
 */
app.base.panel.Persistent.prototype.setUser = function(user) {
  app.base.panel.Persistent.superClass_.setUser.call(this, user);
  this.updateUser();
};

app.base.panel.Persistent.prototype.updateUser = function() {
  var salutation = this.getUser().getSalutation();
  if (this.userButton) {
    var icon = goog.dom.createDom('i', 'icon-cog');
    this.userButton.setContent([icon, salutation]);
  }
};

app.base.panel.Persistent.prototype.logOut = function() {
  var uri = new goog.Uri(urlMap.BASIC.LOGOUT);
  var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
  this.xMan.post(uri, queryData, goog.bind(this.onLogOut, this));
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.panel.Persistent.prototype.onLogOut = function(e) {
  var xhr = e.target;
  if (xhr.isSuccess()) {
    window.open(exp.urlMap.INDEX, '_self');
  } else {
    console.debug('Log Out was not successful. Try again...', e, xhr);
  }
};