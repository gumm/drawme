goog.provide('app.base.view.Home');

goog.require('app.base.panel.MainCanvas');
goog.require('bad.ui.EventType');
goog.require('bad.ui.View');
goog.require('contracts.urlMap');
goog.require('goog.Uri');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.view.Home = function() {
  bad.ui.View.call(this);
};
goog.inherits(app.base.view.Home, bad.ui.View);

app.base.view.Home.prototype.configurePanels = function() {
  var layout = this.getLayout();
  var user = this.getUser();

  var mainCanvas = new app.base.panel.MainCanvas();
  mainCanvas.setUri(new goog.Uri(contracts.urlMap.ROOT.HOME));
  mainCanvas.setUser(user);
  mainCanvas.setNestAsTarget(layout.getNest('main', 'center'));
  this.addPanelToView('home', mainCanvas);
  mainCanvas.renderWithTemplate();


  var leftPalette = new app.base.panel.MainCanvas();
  leftPalette.setUri(new goog.Uri(contracts.urlMap.ROOT.HOME));
  leftPalette.setUser(user);
  leftPalette.setNestAsTarget(layout.getNest('main', 'left', 'mid'));
  leftPalette.setSlideNest(layout.getNest('main', 'left'));
  this.addPanelToView('left_pal', leftPalette);
  leftPalette.renderWithTemplate();


  var rightPalette = new app.base.panel.MainCanvas();
  rightPalette.setUri(new goog.Uri(contracts.urlMap.ROOT.HOME));
  rightPalette.setUser(user);
  rightPalette.setNestAsTarget(layout.getNest('main', 'right', 'mid'));
  rightPalette.setSlideNest(layout.getNest('main', 'right'));
  this.addPanelToView('right_pal', rightPalette);
  rightPalette.renderWithTemplate();


};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.base.view.Home.prototype.onPanelAction = function(e) {

  var panel = e.target;
  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case bad.ui.EventType.READY:
      this.slidePanelIn(/** @type bad.ui.Panel */ (panel));
      break;
    default:
      console.debug('Action not taken.');
  }


};


