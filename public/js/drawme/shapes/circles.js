/**
 * Created by gumm on 2015/12/07.
 */

goog.provide('shapes.Circle');
goog.require('shapes.Rect');

/**
 * A basic circle shape
 * @extends {shapes.Rect}
 * @constructor
 */
shapes.Circle = function() {
  shapes.Rect.call(this);
};
goog.inherits(shapes.Circle, shapes.Rect);

shapes.Circle.prototype.initFromEl = function(el) {

  var cx = Number(el.getAttribute('cx'));
  var cy = Number(el.getAttribute('cy'));
  var rx = Number(el.getAttribute('rx'));
  var ry = Number(el.getAttribute('ry'));

  this.x = cx - rx;
  this.y = cy - ry;
  this.width = rx * 2;
  this.height = ry * 2;
  this.shiftKey = false;
  this.grabX = this.x;
  this.grabY = this.y;
};


shapes.Circle.prototype.rectToCircle = function(clone) {
  return {
    cx: clone.x + clone.width / 2,
    cy: clone.y + clone.height / 2,
    rx: clone.width / 2,
    ry: clone.height / 2
  };
};

shapes.Circle.prototype.updateEl = function(el) {
  var clone = this.rectToCircle(this.normalise());
  el.setAttribute('ry', clone.ry.toString());
  el.setAttribute('rx', clone.rx.toString());
  el.setAttribute('cx', clone.cx);
  el.setAttribute('cy', clone.cy);
};
