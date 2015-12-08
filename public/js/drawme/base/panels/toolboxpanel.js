goog.provide('app.base.panel.ToolBox');

goog.require('app.base.EventType');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.array');
goog.require('goog.dom');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.ToolBox = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.ToolBox, bad.ui.Panel);

app.base.panel.ToolBox.prototype.initDom = function() {

  var tools = goog.dom.getElementsByClass('tool-item', this.getElement());
  goog.array.forEach(tools, function(tool) {
    bad.utils.makeButton(
      tool.id, this,
      goog.bind(this.dispatchActionEvent, this,
          app.base.EventType.DRAWING_TOOL_SELECTED, tool.id));
  }, this);
};
