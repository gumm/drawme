goog.provide('app.base.panel.MainCanvas');

goog.require('bad.ui.Panel');
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
   * @type {shapes.Rect}
   */
  this.rect = new shapes.Rect();

  /**
   * @type {shapes.Circle}
   */
  this.circle = new shapes.Circle();

  this.mouseDown_ = false;

  this.activeTool = 'draw_circle';

};
goog.inherits(app.base.panel.MainCanvas, bad.ui.Panel);


app.base.panel.MainCanvas.prototype.setSelectedTool = function(tool) {
  this.activeTool = tool;
  console.debug('HERE THE TOOL', this.activeTool);
};


app.base.panel.MainCanvas.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());
  this.createSvgEl_();

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
  );
};

//--------------------------------------------------------------[ Transforms ]--

app.base.panel.MainCanvas.prototype.selectToDrag_ = function(e) {
  if (e.target != this.svgElement) {

    console.debug('We came here...');
    this.activeEl_ = e.target;

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
  var actionMap = {
    'draw_circle': goog.bind(this.createCircle, this),
    'draw_rect': goog.bind(this.createRect, this),
    'select_tool': goog.bind(this.selectToDrag_, this)
  };
  actionMap[this.activeTool](e);
};

app.base.panel.MainCanvas.prototype.onMouseMove_ = function(e) {
  var actionMap = {
    'draw_circle': goog.bind(this.drawCircle, this),
    'draw_rect': goog.bind(this.drawRect, this),
    'select_tool': goog.nullFunction
  };
  actionMap[this.activeTool](e);
};

app.base.panel.MainCanvas.prototype.onMouseUp_ = function(e) {
  var actionMap = {
    'draw_circle': goog.bind(this.endCircle, this),
    'draw_rect': goog.bind(this.endRect, this),
    'select_tool': goog.nullFunction
  };
  actionMap[this.activeTool](e);
};


app.base.panel.MainCanvas.prototype.createSvgEl_ = function() {
  this.workBench = goog.dom.getElement('workbench');
  this.svgElement = this.dom_.getDocument().createElementNS(this.svgns, 'svg');
  this.svgElement.setAttribute('width', '500');
  this.svgElement.setAttribute('height', '500');
  goog.style.setStyle(this.svgElement, {
    border: '1px solid #cccccc'
  });
  goog.dom.appendChild(this.workBench, this.svgElement);
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
  this.mouseDown_ = false;
  this.activeEl_ = null;
  this.activeIsInDoc = false;
};

app.base.panel.MainCanvas.prototype.applyFilAndStroke = function(el) {
  goog.style.setStyle(el, {
    'fill': '#cccccc',
    'fill-opacity': 0.2,
    'stroke': '#123',
    'stroke-width': 1.5,
    'stroke-opacity': 0.5
  });
};




