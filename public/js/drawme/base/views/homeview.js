goog.provide('app.base.view.Home');

goog.require('app.base.EventType');
goog.require('app.base.panel.ColorList');
goog.require('app.base.panel.MainCanvas');
goog.require('app.base.panel.PicsList');
goog.require('app.base.panel.ToolBox');
goog.require('bad.ui.EventType');
goog.require('bad.ui.View');
goog.require('contracts.urlMap');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.style');

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
  mainCanvas.setUri(new goog.Uri(contracts.urlMap.DRAW.CANVAS));
  mainCanvas.setUser(user);
  mainCanvas.setNestAsTarget(layout.getNest('main', 'center'));
  this.addPanelToView('home', mainCanvas);
  this.mainCanvas = mainCanvas;

  // The tool panel
  var toolPal = new app.base.panel.ToolBox();
  toolPal.setUri(new goog.Uri(contracts.urlMap.DRAW.LEFT));
  toolPal.setUser(user);
  toolPal.setNestAsTarget(layout.getNest('main', 'left', 'mid'));
  toolPal.setSlideNest(layout.getNest('main', 'left'));
  toolPal.setSlideSize(278);
  this.addPanelToView('left_pal', toolPal);
  this.toolPal = toolPal;

  this.createPicPalette();

};

app.base.view.Home.prototype.createPicPalette = function() {
  var layout = this.getLayout();
  var user = this.getUser();

  // The existing pictures
  var picPal = new app.base.panel.PicsList();
  picPal.setUri(new goog.Uri(contracts.urlMap.PICS.READ));
  picPal.setUser(user);
  picPal.setNestAsTarget(layout.getNest('main', 'right', 'mid'));
  picPal.setSlideNest(layout.getNest('main', 'right'));
  picPal.setSlideSize(10);
  this.addPanelToView('right_pal', picPal);
  this.picPal = picPal;
  this.picPal.renderWithTemplate();
};

app.base.view.Home.prototype.reloadPicPalette = function() {
  this.createPicPalette();
  this.picPal.renderWithTemplate();
};

app.base.view.Home.prototype.displayPanels = function() {
  this.mainCanvas.renderWithTemplate();
  this.toolPal.renderWithTemplate();
};


app.base.view.Home.prototype.createColPal = function(tpe) {
  var layout = this.getLayout();
  var user = this.getUser();

  // The existing pictures
  var colPal = new app.base.panel.ColorList(tpe);
  colPal.setUri(new goog.Uri(contracts.urlMap.PICS.COLORS));
  colPal.setUser(user);
  colPal.setNestAsTarget(layout.getNest('main', 'right', 'mid'));
  colPal.setSlideNest(layout.getNest('main', 'right'));
  colPal.setSlideSize(262);
  this.addPanelToView('right_pal', colPal);
  this.colPal = colPal;
  this.colPal.renderWithTemplate();
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
      var cb = goog.bind(function() {
        this.mainCanvas.updateSvgSize();
      }, this);
      this.slidePanelIn(/** @type bad.ui.Panel */ (panel), cb);
      break;

    case app.base.EventType.DRAWING_SELECTED:
      this.slidePanelClosed(/** @type bad.ui.Panel */ (this.picPal));
      this.mainCanvas.setSvgDrawing(data);
      break;

    case app.base.EventType.DRAWING_TOOL_SELECTED:
      this.mainCanvas.setSelectedTool(data);
      data == 'save_tool' ? this.saveDrawing() : goog.nullFunction();
      data == 'remove_tool' ? this.removeDrawing() : goog.nullFunction();
      data == 'fill_tool' ? this.createColPal('fill') : goog.nullFunction();
      data == 'border_fill' ? this.createColPal('stroke') : goog.nullFunction();
      break;

    case app.base.EventType.TOGGLE_RIGHT_PANEL:
      var tWidth = goog.style.getBounds(this.mainCanvas.getElement()).width;
      this.picPal.setSlideSize(tWidth + 10);
      this.picPal.show();
      this.slidePanelToggle(/** @type bad.ui.Panel */ (this.picPal));
      break;

    case app.base.EventType.CLEAR_CANVAS:
      this.mainCanvas.clearSvgDrawing();
      this.reloadPicPalette();
      break;

    case app.base.EventType.CHANGE_COLOR:
      this.mainCanvas.setColor(data);
      break;

    default:
      console.debug('Action not taken.');
  }
};


app.base.view.Home.prototype.removeDrawing = function() {
  // Get the drawing from the canvas.
  var svg = this.mainCanvas.getSvgDrawing();
  var svgId = svg.getAttribute('id');

  // Hand roll the direct JSON post.
  this.getXMan().del(
      new goog.Uri(contracts.urlMap.PICS.DELETE),
      JSON.stringify({svgId: svgId}),
      goog.bind(this.onRemove, this),
      goog.net.XhrIo.ResponseType.DEFAULT,
      {'Content-Type': 'application/json'}
  );
};

app.base.view.Home.prototype.onRemove = function(e) {
  var xhr = e.target;
  if (xhr.isSuccess()) {
    this.mainCanvas.clearSvgDrawing();
    this.reloadPicPalette();
  } else {
    // Display the errors
  }
};

//--------------------------------------------------------------------[ Save ]--
app.base.view.Home.prototype.saveDrawing = function() {

  // Get the drawing from the canvas.
  var svg = this.mainCanvas.getSvgDrawing();
  var svgId = svg.getAttribute('id');
  var svgText = goog.dom.getOuterHtml(svg);
  var url = svgId ? contracts.urlMap.PICS.UPDATE : contracts.urlMap.PICS.CREATE;

  // Hand roll the direct JSON post.
  this.getXMan().post(
      new goog.Uri(url),
      JSON.stringify({'svgText': svgText, svgId: svgId}),
      goog.bind(this.onSave, this),
      goog.net.XhrIo.ResponseType.DEFAULT,
      {'Content-Type': 'application/json'}
  );
};


app.base.view.Home.prototype.onSave = function(e) {
  var xhr = e.target;
  var data = xhr.getResponseJson();
  if (xhr.isSuccess()) {
    this.reloadPicPalette();

    if (data['data'] && data['data']['_id']) {
      this.mainCanvas.updateSvgId(data['data']['_id']);
    }

  } else {
    // Display the errors
  }
};


