goog.provide('app.BasicView');

goog.require('bad.ui.View');

/**
 * @extends {bad.ui.View}
 * @constructor
 */
app.BasicView = function() {
  bad.ui.View.call(this);
};
goog.inherits(app.BasicView, bad.ui.View);

app.BasicView.prototype.slideNavIn = function() {
  var size = 310;
  var slider = this.getLayout().getNest('main', 'left');
  slider.slideOpen(null, size, goog.nullFunction);
};

app.BasicView.prototype.switchView = function(fn) {
  var nest = this.getLayout().getNest('main', 'left');
  var callback = goog.bind(function() {
    nest.hide();
    fn();
  }, this);
  nest.slideClosed(callback);
};
