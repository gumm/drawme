goog.provide('app.user.EventType');
goog.require('bad.utils');

/**
 * Constants for panel event.
 * @enum {string}
 */
app.user.EventType = {
  EDIT_ACCOUNT: bad.utils.privateRandom(),
  EDIT_PW: bad.utils.privateRandom(),
  VIEW_PIC: bad.utils.privateRandom(),
  CANCEL_VIEW_PIC: bad.utils.privateRandom(),
  VIEW_ACCOUNT: bad.utils.privateRandom(),
  EDIT_ORG: bad.utils.privateRandom(),
  SIGNUP_CANCEL: bad.utils.privateRandom(),
  SIGNUP_SUCCESS: bad.utils.privateRandom(),
  ACCOUNT_REMOVE: bad.utils.privateRandom(),
  ACCOUNT_REMOVE_CANCELED: bad.utils.privateRandom(),
  LOGIN_SUCCESS: bad.utils.privateRandom(),
  PW_RESET_SUCCESS: bad.utils.privateRandom(),
  FORGOT_PW: bad.utils.privateRandom(),
  FORGOT_PW_CANCEL: bad.utils.privateRandom()
};
