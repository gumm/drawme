/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('drawme.Site');

goog.require('app.user.view.Login');
goog.require('app.user.UserManager');
goog.require('app.base.view.Home');
goog.require('bad.ui.EventType');
goog.require('bad.ui.Layout');
goog.require('contracts.urlMap');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');


/**
 * Constructor of the main site object. Inherits from EventHandler, so it
 * can simply subscribe to events on its children.
 * @param {!bad.Net} xManWrapper This site's XhrManager wrapped in a bad.Net
 *      convenience wrapper.
 * @constructor
 * @extends {goog.events.EventHandler}
 */
drawme.Site = function(xManWrapper) {
  goog.events.EventHandler.call(this);

  /**
   * @type {!bad.Net}
   */
  this.xMan_ = xManWrapper;

  /**
   * @type {bad.ui.Layout}
   * @private
   */
  this.layout_ = null;

  /**
   * @type {bad.UserManager}
   * @private
   */
  this.user_ = new app.user.UserManager();

};
goog.inherits(drawme.Site, goog.events.EventHandler);

/**
 * Home page and landing page after login.
 */
drawme.Site.prototype.initSite = function() {
  this.initLayout_();
};

/**
 * Create the layout component.
 * @private
 */
drawme.Site.prototype.initLayout_ = function() {

  var id = 'body-background';
  var mainCells = ['header', 'main', 'footer'];
  var innerCellsHorizontal = ['left', 'center', 'right'];
  var innerCellsVertical = ['top', 'mid', 'bottom'];
  var topMargin = 0;
  var rightMargin = 0;
  var bottomMargin = 0;
  var leftMargin = 0;

  /**
   * Create a new layout
   * @type {bad.ui.Layout}
   * @private
   */
  this.layout_ = new bad.ui.Layout(id, mainCells,
    bad.ui.Layout.Orientation.VERTICAL
  );

  // Set the defaults for the site.
  this.layout_.setTarget(goog.dom.getDocument().body);
  this.layout_.setInitialSize(mainCells[0], 72);
  this.layout_.setInitialSize(mainCells[2], 23);
  this.layout_.setDraggerThickness(0);
  this.layout_.setWidthToViewport(true);
  this.layout_.setHeightToViewport(true);
  this.layout_.setMargin(topMargin, rightMargin, bottomMargin, leftMargin);

  /**
   * Create main horizontal layout.
   * @type {bad.ui.Layout}
   */
  var mainHorizontalLayout = this.layout_.setInnerLayout(
    innerCellsHorizontal,
    mainCells[1],
    bad.ui.Layout.Orientation.HORIZONTAL
  );
  mainHorizontalLayout.setDraggerThickness(5);
  mainHorizontalLayout.setInitialSize(innerCellsHorizontal[0], 220);
  mainHorizontalLayout.setInitialSize(innerCellsHorizontal[2], 220);

  /**
   * Up-Down Layout in the left.
   * @type {bad.ui.Layout}
   */
  var leftVerticalLayout = mainHorizontalLayout.setInnerLayout(
    innerCellsVertical,
    innerCellsHorizontal[0],
    bad.ui.Layout.Orientation.VERTICAL
  );
  leftVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
  leftVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

  /**
   * Up-Down Layout in the right.
   * @type {bad.ui.Layout}
   */
  var rightVerticalLayout = mainHorizontalLayout.setInnerLayout(
    innerCellsVertical,
    innerCellsHorizontal[2],
    bad.ui.Layout.Orientation.VERTICAL
  );
  rightVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
  rightVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

  /**
   * Each if the internal layouts will fire a LAYOUT_READY event, and all
   * of those events bubble to this_layout_. Only when all the internal
   * layouts are ready, does this.layout_ fire its LAYOUT_READY event.
   * So if we just want to react the this.layout_, then we need to
   * check the target id of all events, and simply act when it is the same
   * as this.layout_'s id.
   */
  this.listen(
    this.layout_,
    bad.ui.Layout.EventType.LAYOUT_READY,
    function(e) {
      if (e.target.getId() === id) {
        this.onLayoutReady();
      }
    }
  );

  // Create the layout in the DOM
  this.layout_.render();
};

drawme.Site.prototype.onLayoutReady = function() {
  console.debug('The LAYOUT IS READY!');
  this.hideAllNests();
  this.autoLogin();
};

//--------------------------------------------------------------[ Auto Login ]--

drawme.Site.prototype.autoLogin = function() {
  console.debug('Attempting auto login...');
  var callback = goog.bind(this.onAutoLoginReply, this);
  this.xMan_.get(new goog.Uri(contracts.urlMap.LOG.AUTO), callback);
};

/**
 * {goog.events.EventLike} e Event object.
 */
drawme.Site.prototype.onAutoLoginReply = function(e) {
  console.debug('Got auto login reply');
  var xhr = e.target;
  if (xhr.isSuccess()) {
    console.debug('Got success...');
    var data = xhr.getResponseJson();
    console.debug('Here the data...', data);
    if (data.error) {
      console.debug('Oops. Data shows error. View the login panels.');
      this.viewLogin();
    } else {
      console.debug('Cool. This is as if the user signed in...');
      this.userSignedIn(data['data']);
    }
  } else {
    console.debug('Nope no auto login possible. View the login panels.');
    this.viewLogin();
  }
};

/**
 * @param {Object} userData User profile data.
 */
drawme.Site.prototype.userSignedIn = function(userData) {
  console.debug('userSignedIn', userData);
  goog.dom.classes.add(goog.dom.getElement('body-background'), 'noimg');
  this.user_.updateProfile(userData);
  console.debug('here is the user object', this.user_);
  //this.initHeader();
  console.debug('switching to the home view...');
  this.switchView(new app.base.view.Home())
};


/**
 * @param {boolean=} opt_reset
 */
drawme.Site.prototype.viewLogin = function(opt_reset) {

  /**
   * @type {app.user.view.Login}
   */
  var view = new app.user.view.Login(opt_reset);
  this.switchView(view);
};

//---------------------------------------------------------[ Views Utilities ]--

/**
 * @param {bad.ui.View} view
 */
drawme.Site.prototype.switchView = function(view) {
  if (this.activeView_) {
    this.activeView_.dispose();
  }
  this.activeView_ = view;
  this.activeView_.setLayout(this.layout_);
  this.activeView_.setXMan(this.xMan_);
  this.activeView_.setUser(this.user_);
  this.activeView_.render();
  this.listen(
    this.activeView_, bad.ui.EventType.APP_DO);
};

//-----------------------------------------------------[ Utility Stuff Below ]--

drawme.Site.prototype.hideAllNests = function() {
  /**
   * @type {Array}
   */
  var nests = [
    this.layout_.getNest('main', 'left'),
    this.layout_.getNest('main', 'left', 'top'),
    this.layout_.getNest('main', 'left', 'bottom'),
    this.layout_.getNest('main', 'right'),
    this.layout_.getNest('main', 'right', 'top'),
    this.layout_.getNest('main', 'right', 'bottom')
  ];
  goog.array.forEach(nests, function(nest) {
    nest.hide();
  }, this);
};

drawme.Site.prototype.swapCss = function(filename) {
  document.getElementById('pagestyle').setAttribute('href',
    'css/themes/' + filename + '.css');
};
