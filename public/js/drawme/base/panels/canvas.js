goog.provide('app.base.panel.MainCanvas');

goog.require('bad.ui.Panel');
goog.require('goog.dom');

/**
 * The home panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.MainCanvas = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.MainCanvas, bad.ui.Panel);

app.base.panel.MainCanvas.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());

  app.base.panel.MainCanvas.superClass_.enterDocument.call(this);
};
