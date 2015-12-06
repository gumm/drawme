goog.provide('app.user.UserManager');

/** @typedef {{
*     name: (null|string),
*     surname: (null|string),
*     email: (null|string),
*     user: (null|string)
*     }}
 */
app.user.UserLike;

/**
 * A class to manage the setting and getting of permissions.
 * @constructor
 */
app.user.UserManager = function() {
  /**
   * @type {app.user.UserLike}
   * @private
   */
  this.user_ =  {
        name: null,
        surname: null,
        email: null,
        user: null
    }
};

app.user.UserManager.prototype.updateData = function(data) {
  this.user_ = data;
};

app.user.UserManager.prototype.updateProfile = function(data) {
  this.user_['profile'] = data;
};

app.user.UserManager.prototype.getId = function() {
  return this.user_['_id'];
};

app.user.UserManager.prototype.setId = function(id) {
  this.user_['_id'] = id;
};

app.user.UserManager.prototype.getProfile = function() {
  return this.user_['profile'];
};

app.user.UserManager.prototype.getName = function() {
  return this.getProfile()['name'];
};

app.user.UserManager.prototype.getSurname = function() {
  return this.getProfile()['surname'];
};

app.user.UserManager.prototype.getSalutation = function() {
  var salutation = this.getName();
  var surname = this.getSurname();
  if (surname) {
    salutation = salutation + ' ' + surname;
  }
  return salutation;
};

