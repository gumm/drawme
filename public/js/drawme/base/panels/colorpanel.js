goog.provide('app.base.panel.ColorList');

goog.require('app.base.EventType');
goog.require('bad.ui.Panel');
goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');
goog.require('goog.string');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.ColorList = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.ColorList, bad.ui.Panel);

app.base.panel.ColorList.prototype.initDom = function() {
  this.selectType = goog.dom.getElement('color_selector_type');
  var swatches = goog.dom.getElement('swatches');
  this.getHandler().listen(
      swatches,
      goog.events.EventType.CLICK,
      this.onClick_
  );
};

app.base.panel.ColorList.prototype.setFillType = function(tpe) {
  this.fill_type = tpe;
  goog.dom.setTextContent(
      this.selectType,
      goog.string.toTitleCase(tpe + ' color'));
};

app.base.panel.ColorList.prototype.onClick_ = function(e) {
  var color = goog.dom.dataset.get(e.target, 'col');
  this.dispatchActionEvent(app.base.EventType.CHANGE_COLOR, {
    tpe: this.fill_type,
    color: color
  });
};


