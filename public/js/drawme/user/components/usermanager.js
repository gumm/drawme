goog.provide('bad.UserManager');

goog.require('exp.accountMap');

/**
 * A class to manage the setting and getting of permissions.
 * @constructor
 */
bad.UserManager = function() {
  this.user_ = exp.accountMap({});
};

bad.UserManager.prototype.updateData = function(data) {
  this.user_ = data;
};

bad.UserManager.prototype.updateProfile = function(data) {
  this.user_['profile'] = data;
};

bad.UserManager.prototype.getId = function() {
  return this.user_['_id'];
};

bad.UserManager.prototype.setId = function(id) {
  this.user_['_id'] = id;
};

bad.UserManager.prototype.getProfile = function() {
  return this.user_['profile'];
};

bad.UserManager.prototype.getName = function() {
  return this.getProfile()['name'];
};

bad.UserManager.prototype.getSurname = function() {
  return this.getProfile()['surname'];
};

bad.UserManager.prototype.getSalutation = function() {
  var salutation = this.getName();
  var surname = this.getSurname();
  if (surname) {
    salutation = salutation + ' ' + surname;
  }
  return salutation;
};

