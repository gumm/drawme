/**
 * Created by gumm on 2015/12/07.
 */

goog.provide('shapes.Rect');

/**
 * A basic rectangle shape
 * @constructor
 */
shapes.Rect = function() {
  this.x = 0;
  this.y = 0;
};

shapes.Rect.prototype.init = function(e) {
  this.x = e.offsetX;
  this.y = e.offsetY;
};

shapes.Rect.prototype.initFromEl = function(el) {
  this.x = Number(el.getAttribute('x'));
  this.y = Number(el.getAttribute('y'));
};

shapes.Rect.prototype.translate = function(e, el) {
  var x = this.x + e.left;
  var y = this.y + e.top;
  this.updateEl(el, x, y, null, null);
};

shapes.Rect.prototype.move = function(e, el) {

  var w = Math.abs(e.offsetX - this.x);
  var h = Math.abs(e.offsetY - this.y);
  var c = {x: Math.min(this.x, e.offsetX), y: Math.min(this.y, e.offsetY)};

  if (e.ctrlKey) {
    w = h = Math.max(w, h);
  }

  if (e.shiftKey) {
    c = {
      x: Math.min(this.x - w, e.offsetX),
      y: Math.min(this.y - h, e.offsetY)};
    w = w * 2;
    h = h * 2;
  }

  this.updateEl(el, c.x, c.y, w, h);
};

shapes.Rect.prototype.updateEl = function(el, x, y, w, h) {
  if (w) { el.setAttribute('width', w); }
  if (h) { el.setAttribute('height', h); }
  el.setAttribute('x', x);
  el.setAttribute('y', y);
};


