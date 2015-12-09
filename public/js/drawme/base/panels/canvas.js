goog.provide('app.base.panel.MainCanvas');

goog.require('bad.ui.Panel');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.style');
goog.require('shapes.Circle');
goog.require('shapes.Rect');

/**
 * The home panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.MainCanvas = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);

  this.svgns = 'http://www.w3.org/2000/svg';
  this.activeEl_ = null;

  /**
   * An abstract rect object that is used to manipulate the SVG elements with.
   * @type {shapes.Rect}
   */
  this.rect = new shapes.Rect();

  /**
   * An abstract circle object that is used to manipulate the SVG elements with.
   * @type {shapes.Circle}
   */
  this.circle = new shapes.Circle();

  /**
   * Hand rolled dragging used for draw functions
   * @type {boolean}
   * @private
   */
  this.mouseDown_ = false;

  /**
   * The currently selected active tool item.
   * @type {string}
   */
  this.activeTool = '';

  this.colMap = {
    'fill': '#cccccc',
    'stroke': '#123'
  };

};
goog.inherits(app.base.panel.MainCanvas, bad.ui.Panel);


app.base.panel.MainCanvas.prototype.setSelectedTool = function(tool) {
  if (tool == 'delete_tool') {
    this.onDelete_();
  } else {
    this.activeTool = tool;
  }
};

app.base.panel.MainCanvas.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());
  this.workbench_ = this.dom_.getElement('workbench');
  this.createSvgEl_();
  this.initListners();
};

app.base.panel.MainCanvas.prototype.createSvgEl_ = function() {
  this.svgElement = this.dom_.getDocument().createElementNS(this.svgns, 'svg');
  this.updateSvgSize();
  goog.dom.appendChild(this.workbench_, this.svgElement);
};

app.base.panel.MainCanvas.prototype.updateSvgSize = function() {
  var bounds = goog.style.getBounds(this.workbench_);
  this.svgElement.setAttribute('width', bounds.width.toString());
  this.svgElement.setAttribute('height', bounds.height.toString());
};

app.base.panel.MainCanvas.prototype.updateSvgId = function(id) {
  this.svgElement.setAttribute('id', id);
};

app.base.panel.MainCanvas.prototype.initListners = function() {
  this.getHandler().listen(
      this.svgElement,
      goog.events.EventType.MOUSEDOWN,
      this.onMouseDown_
  ).listen(
      this.svgElement,
      goog.events.EventType.MOUSEMOVE,
      this.onMouseMove_
  ).listen(
      this.svgElement,
      goog.events.EventType.MOUSEUP,
      this.onMouseUp_
  ).listen(
      this.svgElement,
      goog.events.EventType.CLICK,
      this.onClick_
  );
};

app.base.panel.MainCanvas.prototype.getSvgDrawing = function() {
  return this.svgElement || null;
};

app.base.panel.MainCanvas.prototype.setSvgDrawing = function(svg) {
  goog.dom.replaceNode(svg, this.svgElement);
  this.svgElement = svg;
  this.initListners();
};

app.base.panel.MainCanvas.prototype.clearSvgDrawing = function() {
  goog.dom.removeNode(this.svgElement);
  this.svgElement = null;
  this.createSvgEl_();
  this.initListners();
};

app.base.panel.MainCanvas.prototype.setColor = function(data) {

  this.colMap[data.tpe] = data.color;
  var blessed = goog.dom.getElementsByClass('selected', this.svgElement);
  goog.array.forEach(blessed, function(node) {
    this.applyFilAndStroke(node);
  }, this);

};

//--------------------------------------------------------------[ Transforms ]--

app.base.panel.MainCanvas.prototype.onDelete_ = function() {
  // Delete selected
  var condemned = goog.dom.getElementsByClass('selected', this.svgElement);
  goog.array.forEach(condemned, function(node) {
    goog.dom.removeNode(node);
  });
};

app.base.panel.MainCanvas.prototype.onClick_ = function(e) {
  // Select or un-select
  if (e.target != this.svgElement && this.activeTool == 'pic_tool') {
    this.activeEl_ = e.target;
    goog.dom.classlist.toggle(this.activeEl_, 'selected');
  }
};

app.base.panel.MainCanvas.prototype.selectToDrag_ = function(e) {
  if (e.target != this.svgElement) {
    this.activeEl_ = e.target;
    goog.dom.classlist.add(this.activeEl_, 'selected');
    var tool = this.circle;
    if (goog.dom.classlist.contains(this.activeEl_, 'svg-rect')) {
      tool = this.rect;
    }

    tool.initFromEl(this.activeEl_);

    var dragging = goog.bind(function(e) {
      tool.translate(e);
      tool.updateEl(this.activeEl_);
    }, this);

    var dragStop = goog.bind(function(e) {
      this.stopActivity();
    }, this);

    var d = new goog.fx.Dragger(this.activeEl_);
    d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
      dragging(e);
    });
    d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
      d.dispose();
      dragStop();
    });
    d.startDrag(e);
  }
};

app.base.panel.MainCanvas.prototype.onMouseDown_ = function(e) {
  switch (this.activeTool) {
    case 'draw_circle':
      this.createCircle(e);
      break;
    case 'draw_rect':
      this.createRect(e);
      break;
    case 'select_tool':
      this.selectToDrag_(e);
      break;
    default:
      goog.nullFunction();
  }
};

app.base.panel.MainCanvas.prototype.onMouseMove_ = function(e) {
  switch (this.activeTool) {
    case 'draw_circle':
      this.drawCircle(e);
      break;
    case 'draw_rect':
      this.drawRect(e);
      break;
    default:
      goog.nullFunction();
  }
};

app.base.panel.MainCanvas.prototype.onMouseUp_ = function(e) {
  switch (this.activeTool) {
    case 'draw_circle':
      this.endCircle(e);
      break;
    case 'draw_rect':
      this.endRect(e);
      break;
    default:
      goog.nullFunction();
  }
};


//-----------------------------------------------------------------[ Squares ]--

app.base.panel.MainCanvas.prototype.createRect = function(e) {

  this.rect.init(e);
  this.activeIsInDoc = false;
  this.mouseDown_ = true;
  var rect = this.dom_.getDocument().createElementNS(this.svgns, 'rect');
  goog.dom.classlist.add(rect, 'svg-rect');
  this.applyFilAndStroke(rect);
  this.activeEl_ = rect;
  this.rect.updateEl(this.activeEl_);
};

app.base.panel.MainCanvas.prototype.drawRect = function(e) {
  if (this.mouseDown_ === true) {

    this.rect.move(e);
    this.rect.updateEl(this.activeEl_);

    // Place the rect in the document if it was not there before...
    if (!this.activeIsInDoc && this.rect.width != 0 && this.rect.height != 0) {
      goog.dom.appendChild(this.svgElement, this.activeEl_);
      this.activeIsInDoc = true;
    }

  }
};

app.base.panel.MainCanvas.prototype.endRect = function(e) {
  this.drawRect(e);
  this.stopActivity();
};

//-----------------------------------------------------------------[ Circles ]--

app.base.panel.MainCanvas.prototype.createCircle = function(e) {
  this.circle.init(e);
  this.activeIsInDoc = false;
  this.mouseDown_ = true;
  var circle = this.dom_.getDocument().createElementNS(this.svgns, 'ellipse');
  goog.dom.classlist.add(circle, 'svg-circ');
  this.applyFilAndStroke(circle);
  this.activeEl_ = circle;
  this.circle.updateEl(this.activeEl_);
};

app.base.panel.MainCanvas.prototype.drawCircle = function(e) {
  if (this.mouseDown_ === true) {

    this.circle.move(e);
    this.circle.updateEl(this.activeEl_);

    // Place the rect in the document if it was not there before...
    if (!this.activeIsInDoc && this.circle.width != 0 &&
        this.circle.height != 0) {
      goog.dom.appendChild(this.svgElement, this.activeEl_);
      this.activeIsInDoc = true;
    }

  }
};

app.base.panel.MainCanvas.prototype.endCircle = function(e) {
  this.drawCircle(e);
  this.stopActivity();
};


//-----------------------------------------------------------------[ Utility ]--
app.base.panel.MainCanvas.prototype.stopActivity = function() {
  goog.dom.classlist.remove(this.activeEl_, 'selected');
  this.mouseDown_ = false;
  this.activeEl_ = null;
  this.activeIsInDoc = false;
};

app.base.panel.MainCanvas.prototype.applyFilAndStroke = function(el) {
  goog.style.setStyle(el, {
    'fill': this.colMap['fill'],
    'stroke': this.colMap['stroke'],
    'fill-opacity': 0.2,
    'stroke-width': 1.5,
    'stroke-opacity': 0.5
  });
};




