goog.provide('app.base.panel.ToolBox');

goog.require('app.base.EventType');
goog.require('bad.ui.ExButtonGroup');
goog.require('bad.ui.Panel');
goog.require('bad.ui.button');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.style');

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

  var shapeGroup = new bad.ui.ExButtonGroup();
  var shapeIds = ['circle_tool', 'rectangle_tool', 'move_tool', 'select_tool'];

  var strokeFillGroup = new bad.ui.ExButtonGroup();
  var strokeFillIds = ['fill_tool', 'stroke_tool'];

  this.flyOutGroup_ = new bad.ui.ExButtonGroup();
  var flyOutIds = ['list_tool'];
  this.flyOutGroup_.addExGroup(shapeGroup);
  this.flyOutGroup_.addExGroup(strokeFillGroup);


  var normalButtons = ['save_tool', 'delete_tool', 'remove_tool', 'clear_tool'];
  var tools = goog.dom.getElementsByClass('tool-item', this.getElement());
  goog.array.forEach(tools, function(tool) {
    if (goog.array.contains(normalButtons, tool.id)) {
      bad.ui.button.makeButton(
          tool.id,
          this,
          goog.bind(
              this.dispatchActionEvent,
              this,
              app.base.EventType.DRAWING_TOOL_SELECTED,
              {name: tool.id}));
    } else {
      var but = bad.utils.makeToggleButton(
          tool.id,
          this,
          goog.bind(function(isChecked) {
            this.dispatchActionEvent(
                app.base.EventType.DRAWING_TOOL_SELECTED,
                {name: tool.id, isChecked: isChecked});
          }, this));

      // Exclusive button set for fill and stroke
      if (goog.array.contains(strokeFillIds, tool.id)) {
        strokeFillGroup.addToggleButton(but);
      }

      // Exclusive button set for shapes
      if (goog.array.contains(shapeIds, tool.id)) {
        shapeGroup.addToggleButton(but);
      }

      // Exclusive button set for shapes
      if (goog.array.contains(flyOutIds, tool.id)) {
        this.flyOutGroup_.addToggleButton(but);
      }


    }
  }, this);
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

app.base.panel.ToolBox.prototype.unSelectToggles = function() {
  this.flyOutGroup_.setChecked(false);
};

app.base.panel.ToolBox.prototype.spinSaveTool = function(bool) {
  if (!this.saveIcon_) {
    this.saveIcon_ = goog.dom.getFirstElementChild(
        goog.dom.getElement('save_tool'));
  }
  if (bool) {
    goog.dom.classlist.add(this.saveIcon_, 'rotate');
  } else {
    goog.dom.classlist.remove(this.saveIcon_, 'rotate');
  }
};
