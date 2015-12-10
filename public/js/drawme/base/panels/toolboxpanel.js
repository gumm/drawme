goog.provide('app.base.panel.ToolBox');

goog.require('app.base.EventType');
goog.require('bad.ui.EventType');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.style');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.ToolBox = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
  this.buttonMap_ = {};
};
goog.inherits(app.base.panel.ToolBox, bad.ui.Panel);

app.base.panel.ToolBox.prototype.initDom = function() {
  var tools = goog.dom.getElementsByClass('tool-item', this.getElement());

  this.getHandler().listen(
      this,
      bad.ui.EventType.ACTION,
      goog.bind(this.onOwnAction, this)
  );

  // Init the elements to buttons that fire action events with their ids.
  var normalButtons = ['save_tool', 'delete_tool', 'remove_tool', 'list_tool',
      'clear_tool'];
  goog.array.forEach(tools, function(tool) {
    if (goog.array.contains(normalButtons, tool.id)) {
      this.buttonMap_[tool.id] = bad.utils.makeButton(
          tool.id, this, goog.bind(this.dispatchActionEvent, this,
              app.base.EventType.DRAWING_TOOL_SELECTED, tool.id));
    } else {
        this.buttonMap_[tool.id] = bad.utils.makeToggleButton(
            tool.id, this, goog.bind(this.dispatchActionEvent, this,
              app.base.EventType.DRAWING_TOOL_SELECTED, tool.id));
    }
  }, this);


};

app.base.panel.ToolBox.prototype.onOwnAction = function(e) {
  var buttons = e.target.children_;
  var value = e.getValue();
  var data = e.getData();
  switch (value) {
    case app.base.EventType.DRAWING_TOOL_SELECTED:
      this.unSelectEveryoneElse(buttons, data);
      this.doMore(buttons, data);
      break;
    default:
      goog.nullFunction();
  }
};

app.base.panel.ToolBox.prototype.unSelectEveryoneElse = function(
    buttons, data) {

  goog.array.forEach(buttons, function(button) {
      if (button.getElement().id != data) {
        button.setChecked(false);
      }
    });
};

app.base.panel.ToolBox.prototype.doMore = function(buttons, data) {
  switch (data) {
    case 'list_tool':
      this.dispatchActionEvent(app.base.EventType.TOGGLE_RIGHT_PANEL);
      break;
    case 'clear_tool':
      this.dispatchActionEvent(app.base.EventType.CLEAR_CANVAS);
      break;
    default:
      goog.nullFunction();
  }
};

app.base.panel.ToolBox.prototype.setColor = function(data) {
  var selector = 'svg-icon-fill';
  if (data.tpe == 'stroke') {
    selector = 'svg-icon-outline';
  }
  var blessed = goog.dom.getElementsByClass(selector, this.getElement());
  goog.array.forEach(blessed, function(node) {
    goog.style.setStyle(node, {
      'fill': data.color,
      'color': data.color,
      'fill-opacity': 1
    });
  }, this);

};
