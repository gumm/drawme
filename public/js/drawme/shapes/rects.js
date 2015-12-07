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
  this.width = 0;
  this.height = 0;
};

shapes.Rect.prototype.init = function(e) {
  this.x = e.offsetX;
  this.y = e.offsetY;
};

shapes.Rect.prototype.move = function(e) {
  this.width = e.offsetX - this.x;
  this.height = e.offsetY - this.y;
  if (e.ctrlKey) {
    this.width = this.height = Math.max(this.width, this.height);
  }
  this.shiftKey = !!e.shiftKey;
};

/**
 * SVG does not do negative width and height. Thus:
 * When the width or height goes negative, swap it with its
 * corresponding position.
 */
shapes.Rect.prototype.normalise = function() {
  var clone = {
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height
  };
  if (this.width < 0) {
    clone.width = Math.abs(this.width);
    clone.x = this.x + this.width;
    if (this.shiftKey) {
      clone.x += clone.width;
    }
  }
  if (this.height < 0) {
    clone.height = Math.abs(this.height);
    clone.y = this.y + this.height;
    if (this.shiftKey) {
      clone.y += clone.height;
    }
  }
  if (this.shiftKey) {
    clone = {
      x: clone.x - clone.width,
      y: clone.y - clone.height,
      width: clone.width * 2,
      height: clone.height * 2
    };
  }
  return clone;
};

shapes.Rect.prototype.updateEl = function(el) {
  var clone = this.normalise();
  el.setAttribute('width', clone.width.toString());
  el.setAttribute('height', clone.height.toString());
  el.setAttribute('x', clone.x);
  el.setAttribute('y', clone.y);
};

