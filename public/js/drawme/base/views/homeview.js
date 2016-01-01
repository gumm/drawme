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
   * @type {Object}
   * @private
   */
  this.rightSlider_ = layout.getNest('main', 'right');

  this.rightPanelTarget_ = layout.getNest('main', 'right', 'mid');

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
  mainCanvas.setBeforeReadyCallback(goog.bind(
      mainCanvas.dispatchActionEvent, mainCanvas, 'MAIN_CANVAS'));
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
  toolPal.setBeforeReadyCallback(goog.bind(
      toolPal.dispatchActionEvent, toolPal, 'TOOL_PALETTE'));
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
  picPal.setNestAsTarget(this.rightPanelTarget_);
  picPal.setSlideNest(this.rightSlider_);
  picPal.setSlideSize(10);
  picPal.setBeforeReadyCallback(goog.bind(
      picPal.dispatchActionEvent, picPal, 'PIC_PALETTE'));
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
  colPal.setNestAsTarget(this.rightPanelTarget_);
  colPal.setSlideNest(this.rightSlider_);
  colPal.setSlideSize(262);
  colPal.setBeforeReadyCallback(goog.bind(
      colPal.dispatchActionEvent, colPal, 'COLOR_PALETTE'));
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
      console.debug('SIMPLE PANEL READY');
      break;

    case 'MAIN_CANVAS':
      console.debug('MAIN_CANVAS Panel Ready');
      panel.updateSvgSize();
      break;

    case 'TOOL_PALETTE':
      console.debug('TOOL_PALETTE Panel Ready');
      this.slidePanelIn(/** @type bad.ui.Panel */ (panel));
      break;

    case 'PIC_PALETTE':
      console.debug('PIC_PALETTE Panel Ready');
      this.slidePanelIn(/** @type bad.ui.Panel */ (panel));
      break;

    case 'COLOR_PALETTE':
      console.debug('COLOR_PALETTE Panel Ready');
      panel.hide();
      break;

    case app.base.EventType.DRAWING_SELECTED:
      console.debug('DRAWING_SELECTED');
      this.slidePanelClosed(/** @type bad.ui.Panel */ (this.picPal));
      this.mainCanvas.setSvgDrawing(data);
      this.toolPal.unSelectToggles();
      break;

    case app.base.EventType.DRAWING_TOOL_SELECTED:
      console.debug('DRAWING_TOOL_SELECTED', data);
      this.onToolSelected(data);
      break;

    case app.base.EventType.CHANGE_COLOR:
      console.debug('CHANGE_COLOR', data);
      this.mainCanvas.setColor(data);
      this.toolPal.setColor(data);
      break;

    default:
      console.debug('NO ACTION', value, data);
      goog.nullFunction();
  }
};


//----------------------------------------------------[ Drawing tool actions ]--
/**
 * @param {Function=} opt_cb
 * @private
 */
app.base.view.Home.prototype.updateRightPanel_ = function(opt_cb) {
  this.rightSlider_.slideClosed(opt_cb);
};


app.base.view.Home.prototype.onToolSelected = function(data) {
  var slideColPanelIn = goog.bind(function() {
    this.picPal.hide();
    this.colPal.show();
    this.slidePanelIn(this.colPal);
  }, this);

  var slidePicPanelIn = goog.bind(function() {
    this.colPal.hide();
    this.picPal.show();
    var tWidth = goog.style.getBounds(this.mainCanvas.getElement()).width;
    this.picPal.setSlideSize(tWidth + 10);
    this.slidePanelIn(this.picPal);
  }, this);

  switch (data.name) {
    case 'save_tool':
      this.mainCanvas.unSelectAll();
      this.saveDrawing();
      break;
    case 'remove_tool':
      this.removeDrawing();
      break;
    case 'clear_tool':
      this.mainCanvas.clearSvgDrawing();
      break;
    case 'pic_tool':
      this.mainCanvas.setSelectedTool(data.name);
      if (!data.isChecked) {
        this.mainCanvas.unSelectAll();
      }
      break;
    case 'select_tool':
    case 'draw_circle':
    case 'draw_rect':
      this.mainCanvas.setSelectedTool(data.name);
      this.mainCanvas.unSelectAll();
      break;
    case 'border_fill':
      this.colPal.setFillType('stroke');
      data.isChecked ? this.updateRightPanel_(slideColPanelIn) :
          this.updateRightPanel_();
      break;
    case 'fill_tool':
      this.colPal.setFillType('fill');
      data.isChecked ? this.updateRightPanel_(slideColPanelIn) :
          this.updateRightPanel_();
      break;
    case 'list_tool':
      data.isChecked ? this.updateRightPanel_(slidePicPanelIn) :
          this.updateRightPanel_();
      break;
    case 'delete_tool':
      this.mainCanvas.deleteSelected();
      break;
    default:
      console.debug('No action...');
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


