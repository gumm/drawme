goog.provide('app.base.EventType');
goog.provide('app.base.ViewEventType');

goog.require('bad.utils');

/**
 * Constants for panel event.
 * @enum {string}
 */
app.base.EventType = {
  EDIT_PROFILE: bad.utils.privateRandom(),
  MENU_HEAD: bad.utils.privateRandom(),
  DRAWING_TOOL_SELECTED: bad.utils.privateRandom(),
  DRAWING_SELECTED: bad.utils.privateRandom(),
  TOGGLE_RIGHT_PANEL: bad.utils.privateRandom()
};

/**
 * These are events that are edited by vies, and handled at the top level
 * Typically these switch between views.
 * @enum {!string}
 */
app.base.ViewEventType = {
  UPDATE_USER: bad.utils.privateRandom(),
  VIEW_EDIT_USER: bad.utils.privateRandom(),
  USER_LOGGED_IN: bad.utils.privateRandom(),
  VIEW_LOGIN: bad.utils.privateRandom(),
  RESET_PASSWORD: 'resetpw',
  AUTO: bad.utils.privateRandom(),
  VIEW_HOME: bad.utils.privateRandom(),
  VIEW_ORG_CREATE: bad.utils.privateRandom(),
  VIEW_ORG: bad.utils.privateRandom(),
  SWAP_THEME: bad.utils.privateRandom()
};
