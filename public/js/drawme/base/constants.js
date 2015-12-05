goog.provide('app.base.EventType');

goog.require('bad.utils');

/**
 * Constants for panel event.
 * @enum {string}
 */
app.base.EventType = {
  EDIT_PROFILE: bad.utils.privateRandom(),
  MENU_HEAD: bad.utils.privateRandom()
};
