goog.provide('app.base.ViewManager');

goog.require('app.base.EventType');
goog.require('app.base.TopBarPanel');
goog.require('app.base.ViewEventType');
goog.require('app.base.view.Home');
goog.require('app.user.EventType');
goog.require('app.user.view.Account');
goog.require('app.user.view.Login');
goog.require('bad.UserManager');
goog.require('bad.ui.View');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.object');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.ViewManager = function() {
  bad.ui.View.call(this);

  this.listOfViewEvents_ = [];
  goog.object.forEach(app.base.ViewEventType, function(v, k) {
    this.listOfViewEvents_.push(v);
  }, this);

  /**
   * @type {bad.UserManager}
   * @private
   */
  this.user_ = new bad.UserManager();
};
goog.inherits(app.base.ViewManager, bad.ui.View);

/**
 * @inheritDoc
 */
app.base.ViewManager.prototype.configurePanels = function() {

  var headerPanel = new app.base.TopBarPanel();
  headerPanel.setUri(new goog.Uri(contracts.urlMap.ROOT.HEADER));
  headerPanel.setUser(this.getUser());
  headerPanel.setNestAsTarget(this.getLayout().getNest('header'));
  this.addPanelToView(bad.utils.makeId(), headerPanel);
  headerPanel.renderWithTemplate();
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.base.ViewManager.prototype.onPanelAction = function(e) {

  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case app.base.EventType.EDIT_PROFILE:
        var cb = goog.bind(function() {
          this.viewEditUser();
        }, this);
        this.activeView_.slideAllClosed(cb);
      break;
    case app.user.EventType.VIEW_PIC:
        console.debug('We need to go to the list drawings view');
      //this.switchView(goog.bind(
      //  this.appDo, this, app.doMap.VIEW_EDIT_USER, 'orgList'));
      break;
    default:
      goog.nullFunction();
//      console.log('app.base.ViewManager No case for: ', value, data);
  }
};

app.base.ViewManager.prototype.onViewAction = function(e) {
  var data = e.data;
  switch (e.type) {
    case app.base.ViewEventType.USER_LOGGED_IN:
      console.debug('A user signed in - viewmanager knows about this...');
      this.userSignedIn(data);
      break;
    case app.base.ViewEventType.VIEW_HOME:
      this.viewHome();
      break;
    default:
      console.debug('Not recognised...', e.value);
  }
};


app.base.ViewManager.prototype.setActiveView = function(view) {
  this.activeView_ = view;

  this.getHandler().listen(
      this.activeView_,
      this.listOfViewEvents_,
      this.onViewAction
  );
};


//------------------------------------------------------------[ User Sign IN ]--
/**
 * All sign in comes here. Auto sign in via an recognised session on the server
 * or manual log in from the front.
 * @param {bad.UserLike} userData User profile data.
 */
app.base.ViewManager.prototype.userSignedIn = function(userData) {
  goog.dom.classes.add(goog.dom.getElement('body-background'), 'noimg');
  this.user_.updateProfile(userData);
  this.setUser(this.user_);
  this.render();
  this.viewHome();
};


//-------------------------------------------------------------------[ Views ]--
/**
 * Display the loin view.
 */
app.base.ViewManager.prototype.viewLogin = function(opt_reset) {

  /**
   * @type {app.user.view.Login}
   */
  var view = new app.user.view.Login(opt_reset ? true : false);
  this.switchView(view);
};


app.base.ViewManager.prototype.viewHome = function() {
  /**
   * @type {app.base.view.Home}
   */
  var view = new app.base.view.Home();
  this.switchView(view);
};

app.base.ViewManager.prototype.viewEditUser = function() {
  /**
   * @type {app.user.view.Account}
   */
  var view = new app.user.view.Account();
  this.switchView(view);
};


//---------------------------------------------------------[ Views Utilities ]--

/**
 * @param {bad.ui.View} view
 */
app.base.ViewManager.prototype.switchView = function(view) {
  this.hideAllNests();
  if (this.activeView_) {
    this.activeView_.dispose();
  }
  this.activeView_ = view;
  this.activeView_.setLayout(this.layout_);
  this.activeView_.setXMan(this.xMan_);
  this.activeView_.setUser(this.user_);
  this.activeView_.render();
  this.setActiveView(this.activeView_);
};


/**
 * Hide all the nests. Presents a single panel.
 */
app.base.ViewManager.prototype.hideAllNests = function() {
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


