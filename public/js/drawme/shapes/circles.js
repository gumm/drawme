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
  this.ry = 0;
  this.rx = 0;
};
goog.inherits(shapes.Circle, shapes.Rect);

shapes.Circle.prototype.initFromEl = function(el) {
  var cx = Number(el.getAttribute('cx'));
  var cy = Number(el.getAttribute('cy'));
  this.rx = Number(el.getAttribute('rx'));
  this.ry = Number(el.getAttribute('ry'));
  this.x = cx - this.rx;
  this.y = cy - this.ry;
};

shapes.Circle.prototype.updateEl = function(el, x, y, opt_w, opt_h) {
  var h = opt_h || 2 * this.ry;
  var w = opt_w || 2 * this.rx;
  var ry = h / 2;
  var rx = w / 2;
  if (opt_h) { el.setAttribute('ry', ry); }
  if (opt_w) { el.setAttribute('rx', rx); }
  el.setAttribute('cx', x + rx);
  el.setAttribute('cy', y + ry);
};
