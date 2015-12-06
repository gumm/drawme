goog.provide('app.base.panel.Home');

goog.require('bad.ui.Panel');
goog.require('goog.dom');

/**
 * The home panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Home = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.Home, bad.ui.Panel);

app.base.panel.Home.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());

  app.base.panel.Home.superClass_.enterDocument.call(this);
};
