/**
 * Created by gumm on 2015/12/07.
 */

goog.provide('shapes.Circle');

/**
 * A basic rectangle shape
 * @constructor
 */
shapes.Circle = function() {
  this.x = 0;
  this.y = 0;
  this.a = 0;
  this.t = 0;
};

shapes.Circle.prototype.setPosition = function(x,y) {
  this.x = x;
  this.y = y;
};

shapes.Circle.prototype.setSize = function(a,t) {
  this.a = a;
  this.t = t;
};
