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
  /**
   * @type {bad.ui.Layout}
   */
  var layout = this.getLayout();

  /**
   * @type {bad.UserManager}
   */
  var user = this.getUser();

  this.mainCanvas = this.createCanvas(layout, user);
  this.toolPal = this.createToolPalette(layout, user);
  this.picPal = this.createPicPalette();
  this.colPal = this.createColPal(layout, user);
};

/**
 * @param {bad.ui.Layout} layout
 * @param {bad.UserManager} user
 * @return {app.base.panel.MainCanvas}
 */
app.base.view.Home.prototype.createCanvas = function(layout, user) {
  var mainCanvas = new app.base.panel.MainCanvas();
  mainCanvas.setUri(new goog.Uri(contracts.urlMap.DRAW.CANVAS));
  mainCanvas.setUser(user);
  mainCanvas.setNestAsTarget(layout.getNest('main', 'center'));
  this.addPanelToView('home', mainCanvas);
  return mainCanvas;
};

/**
 * @param {bad.ui.Layout} layout
 * @param {bad.UserManager} user
 * @return {app.base.panel.ToolBox}
 */
app.base.view.Home.prototype.createToolPalette = function(layout, user) {

  // The tool panel
  var toolPal = new app.base.panel.ToolBox();
  toolPal.setUri(new goog.Uri(contracts.urlMap.DRAW.LEFT));
  toolPal.setUser(user);
  toolPal.setNestAsTarget(layout.getNest('main', 'left', 'mid'));
  toolPal.setSlideNest(layout.getNest('main', 'left'));
  toolPal.setSlideSize(278);
  this.addPanelToView('left_pal', toolPal);
  return toolPal;

};

/**
 * @return {app.base.panel.PicsList}
 */
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
  return picPal;
};

/**
 * @param {bad.ui.Layout} layout
 * @param {bad.UserManager} user
 * @return {app.base.panel.ColorList}
 */
app.base.view.Home.prototype.createColPal = function(layout, user) {

  // The existing pictures
  var colPal = new app.base.panel.ColorList();
  colPal.setUri(new goog.Uri(contracts.urlMap.PICS.COLORS));
  colPal.setUser(user);
  colPal.setNestAsTarget(layout.getNest('main', 'right', 'mid'));
  colPal.setSlideNest(layout.getNest('main', 'right'));
  colPal.setSlideSize(262);
  this.addPanelToView('col_pal', colPal);
  return colPal;

};

app.base.view.Home.prototype.reloadPicPalette = function() {
  goog.dom.removeNode(this.picPal.getElement());
  this.picPal.dispose();
  delete this.picPal;
  this.picPal = this.createPicPalette();
  this.picPal.renderWithTemplate();
};

app.base.view.Home.prototype.displayPanels = function() {
  this.mainCanvas.renderWithTemplate();
  this.toolPal.renderWithTemplate();
  this.picPal.renderWithTemplate();
  this.colPal.renderWithTemplate();
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.base.view.Home.prototype.onPanelAction = function(e) {


  var panel = /** @type bad.ui.Panel */(e.target);
  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {

    case bad.ui.EventType.READY:
      var cb = goog.bind(function() {
        this.mainCanvas.updateSvgSize();
      }, this);
      this.slidePanelIn(/** @type bad.ui.Panel */ (panel), cb);
      if (panel == this.colPal) {
        this.colPal.hide();
      }
      break;

    case app.base.EventType.DRAWING_SELECTED:
      this.slidePanelClosed(/** @type bad.ui.Panel */ (this.picPal));
      this.mainCanvas.setSvgDrawing(data);
      break;

    case app.base.EventType.DRAWING_TOOL_SELECTED:
      this.mainCanvas.setSelectedTool(data);
      data == 'save_tool' ? this.saveDrawing() : goog.nullFunction();
      data == 'remove_tool' ? this.removeDrawing() : goog.nullFunction();

      if (data == 'fill_tool') {
        this.colPal.setFillType('fill');
        this.colPal.show();
        this.picPal.hide();
        this.slidePanelIn(this.colPal);
      }
      if (data == 'border_fill') {
        this.colPal.setFillType('stroke');
        this.colPal.show();
        this.picPal.hide();
        this.slidePanelIn(this.colPal);
      }
      break;

    case app.base.EventType.TOGGLE_RIGHT_PANEL:
      this.colPal.hide();
      this.picPal.show();

      var tWidth = goog.style.getBounds(this.mainCanvas.getElement()).width;
      this.picPal.setSlideSize(tWidth + 10);
      this.slidePanelToggle(this.picPal);
      break;

    case app.base.EventType.CLEAR_CANVAS:
      this.mainCanvas.clearSvgDrawing();
      break;

    case app.base.EventType.CHANGE_COLOR:
      this.mainCanvas.setColor(data);
      this.toolPal.setColor(data);
      break;

    default:
      goog.nullFunction();
  }
};

//------------------------------------------------------------------[ Delete ]--

app.base.view.Home.prototype.removeDrawing = function() {
  // Get the drawing from the canvas.
  var svg = this.mainCanvas.getSvgDrawing();
  var svgId = svg.getAttribute('id');

  // Hand roll the direct JSON post.
  this.getXMan().del(
      new goog.Uri(contracts.urlMap.PICS.DELETE + '/' + svgId),
      null,
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


