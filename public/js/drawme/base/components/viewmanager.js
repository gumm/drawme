goog.provide('app.base.ViewManager');

goog.require('app.base.EventType');
goog.require('app.base.ViewEventType');
goog.require('app.base.panel.Persistent');
goog.require('app.user.EventType');
goog.require('bad.ui.View');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.Uri');
goog.require('goog.object');
goog.require('app.base.view.Home');

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
  console.debug(this.listOfViewEvents_);
};
goog.inherits(app.base.ViewManager, bad.ui.View);

app.base.ViewManager.prototype.configurePanels = function() {

  var headerPanel = new app.base.panel.Persistent();
  headerPanel.setUri(new goog.Uri(contracts.urlMap.ROOT.HEADER));
  headerPanel.setUser(this.getUser());
  headerPanel.setNestAsTarget(this.getLayout().getNest('header'));
  this.addPanelToView(bad.utils.makeId(), headerPanel);
  headerPanel.renderWithTemplate();
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.ViewManager.prototype.onPanelAction = function(e) {

  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case app.base.EventType.EDIT_PROFILE:
        console.debug('We need to go to the edit user view');
      //this.switchView(goog.bind(
      //  this.appDo, this, app.doMap.VIEW_EDIT_USER));
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
      this.userSignedIn(data);
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
  this.switchView(new app.base.view.Home());
};


//---------------------------------------------------------[ Views Utilities ]--

/**
 * @param {bad.ui.View} view
 */
app.base.ViewManager.prototype.switchView = function(view) {
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


