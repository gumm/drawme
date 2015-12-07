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
  this.w = 0;
  this.h = 0;
  this.r = 0;
};

shapes.Rect.prototype.setPosition = function(x,y) {
  this.x = x;
  this.y = y;
};

shapes.Rect.prototype.setSize = function(w,h) {
  this.w = w;
  this.h = h;
};

shapes.Rect.prototype.setRotation = function(r) {
  this.r = r;
};


