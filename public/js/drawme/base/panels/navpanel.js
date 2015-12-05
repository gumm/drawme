goog.provide('app.base.NavPanel');

goog.require('app.base.EventType');
goog.require('bad.ui.MenuFlatRenderer');
goog.require('bad.ui.MenuItemRenderer');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.dom.classes');
goog.require('goog.events.EventType');

/**
 * An organization nav panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.NavPanel = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);

  this.menu_ = null;
};
goog.inherits(app.base.NavPanel, bad.ui.Panel);

app.base.NavPanel.prototype.initDom = function() {
  this.buildNavMenu();
};

app.base.NavPanel.prototype.buildNavMenu = function() {

  var menuItems = this.getMenuItems();
  var renderer = bad.ui.MenuFlatRenderer.getInstance();
  var itemRenderer = bad.ui.MenuItemRenderer.getInstance();
  var stickySelect = true; // This keeps the last selected item highlighted.
  this.menu_ = bad.utils.makeMenu(
    menuItems, this.dom_, this.getHandler(), this, renderer,
    itemRenderer, stickySelect);

  this.addChild(this.menu_);
  this.menu_.render(this.getElement());
  var menuElement = this.menu_.getElement();
  goog.dom.classes.add(menuElement, 'well', 'menu-nav');

  this.appendMenuTitle();
  this.resetMenu();
};

app.base.NavPanel.prototype.getMenuItems = function() {
  return [];
};

app.base.NavPanel.prototype.appendMenuTitle = function() {
  this.nameEl_ = this.dom_.createDom('h3', {style: 'margin: 0'}, '');
  var child = this.dom_.createDom('div', 'menu-head', this.nameEl_);
  this.dom_.insertChildAt(
    this.dom_.getElementByClass('menu-nav',
      this.getElement()), child, 0);
  this.getHandler().listen(
    child,
    goog.events.EventType.CLICK,
    function() {
      this.dispatchActionEvent(app.base.EventType.MENU_HEAD);
    }
  );
};

app.base.NavPanel.prototype.resetMenu = goog.nullFunction;
