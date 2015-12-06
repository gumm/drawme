goog.provide('app.base.view.Persistent');

goog.require('app.base.EventType');
goog.require('app.base.panel.Persistent');
goog.require('app.base.ViewEventType');
goog.require('app.user.EventType');
goog.require('bad.ui.View');
goog.require('bad.utils');
goog.require('contracts.urlMap');
goog.require('goog.Uri');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.view.Persistent = function() {
  bad.ui.View.call(this);
};
goog.inherits(app.base.view.Persistent, bad.ui.View);

app.base.view.Persistent.prototype.configurePanels = function() {

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
app.base.view.Persistent.prototype.onPanelAction = function(e) {

  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case app.base.EventType.EDIT_PROFILE:
        console.debug('We need to go to the edit user view')
      //this.switchView(goog.bind(
      //  this.appDo, this, app.doMap.VIEW_EDIT_USER));
      break;
    case app.user.EventType.VIEW_PIC:
        console.debug('We need to go to the list drawings view')
      //this.switchView(goog.bind(
      //  this.appDo, this, app.doMap.VIEW_EDIT_USER, 'orgList'));
      break;
    default:
      goog.nullFunction();
//      console.log('app.base.view.Persistent No case for: ', value, data);
  }
};

app.base.view.Persistent.prototype.onViewAction = function(e) {
  console.debug('THE VIEW MANAGER GOT THIS', e)
};


app.base.view.Persistent.prototype.setActiveView = function(view) {
  this.activeView_ = view;
  this.listen(
    this.activeView_, bad.ui.EventType.APP_DO, this.onViewAction);

};


