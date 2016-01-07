var bcrypt = require('bcrypt');
var uuid = require('uuid');
var connectAndClose = require('./mongo-helpers').connectAndClose;
var ACCOUNTS = 'accounts';
var PASSWORDS = 'pwhash';


/**
 * This takes care of all the DB interactions for an account - a user
 */
module.exports = {

  /**
   * @param data
   * @return {Object.<string, string>}
   */
  accountMap: function(data) {
    return {
      name: data.name || null,
      surname: data.surname || null,
      email: data.email || null,
      user: data.user || null
    };
  },

  /**
   * @param user
   * @param pass
   * @param callback
   */
  manualLogin: function(user, pass, callback) {

    /**
     * An error object that maps to the form's field names.
     * @type {{user: (null|string), pass: (null|string)}}
     */
    var error = {
      user: null,
      pass: 'User password mismatch.'
    };

    var matchUsers = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      var pwHashes = db.collection(PASSWORDS);

      var onAccountFound = function(err, account) {
        if (account) {

          var onHashFound = function(err, hashDoc) {
            if (hashDoc) {

              bcrypt.compare(pass, hashDoc.pw, function(err, isValid) {
                isValid ? cb(null, account) : cb(error);
              });

            } else {
              // Password hash not found...
              // This is a problem
              cb(error);
            }
          };

          var pwFilter = {'user': account._id};
          pwHashes.find(pwFilter).limit(1).next(onHashFound)

        } else {
          cb(error);
        }
      };

      var filter = {'user': user};
      accounts.find(filter).limit(1).next(onAccountFound);
    };

    connectAndClose(matchUsers, callback);
  },

  /**
   * @param newAccount
   * @param clearPW
   * @param callback
   */
  addNewAccount: function(newAccount, clearPW, callback) {
    var targetUName = newAccount.user;
    var targetPass = clearPW;
    var targetEmail = newAccount.email;

    /**
     * An error object that maps to the form's field names.
     * @type {{user: (null|string), email: (null|string)}}
     */
    var error = {
      user: null,
      email: null
    };

    var finalInsert = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      var pwHashes = db.collection(PASSWORDS);
      accounts.insertOne(newAccount, function(err, r) {
        if (r) {

          var newUser = r.ops[0];
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(targetPass, salt, function(err, hash) {
              // Store hash in your password DB.
              var pWord = {'user': newUser._id, 'pw': hash};
              pwHashes.insertOne(pWord, function(err, pRes) {
                cb(err, newUser);
              })
            });
          });

        } else {
          // Could not insert account...
          cb(error, null);
        }

      })
    };

    /**
     * A method to check that we only store unique user names and emails.
     * @param {Object} db
     * @param {Function} cb
     */
    var checkAndInsertAccount = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);

      // See if this username or email already exists
      var filter = {
        $or: [
          {"user": targetUName},
          {"email": targetEmail}]
      };
      accounts.find(filter).limit(1).next(function(err, doc) {
        if (doc && doc.user == targetUName) {
          error.user = 'This username is not available';
          cb(error, null);

        } else if (doc &&  doc.email == targetEmail) {
          error.email = 'This email is already registered. ' +
              'Maybe request a password reset.';
          cb(error, null);

        } else {
          finalInsert(db, cb);
        }
      });
    };

    connectAndClose(checkAndInsertAccount, callback);
  },

  /**
   * Remove both the account and the password entry from the db.
   * @param account
   * @param callback
   */
  deleteAccount: function(account, callback) {

    var removeAccount = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      var pwHashes = db.collection(PASSWORDS);
      var filter = {'user': account.user};
      var onHashDelete = function(e, r) {
        e ? cb('Could not delete account.') : accounts.deleteOne(filter, cb);
      };
      pwHashes.deleteOne(filter, onHashDelete);
    };

    connectAndClose(removeAccount, callback);
  },

  /**
   * Seeds the account credentials with a new key: 'tpass', and assign a random,
   * hash as the value. This is used to validate the link sent to the user's
   * email account when a lost password reset email is sent.
   * @param email
   * @param callback
   */
  seedAccountWithResetKey: function(email, callback) {

    var seedAccount = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(uuid.v4(), salt, function(err, hash) {

          // Store hash in your password DB.
          var filter = {'email': email};
          var update = {$set: {'tpass': hash}};
          var options = {returnOriginal: false};
          accounts.findOneAndUpdate(filter, update, options, cb);

        });
      });
    };

    connectAndClose(seedAccount, callback);
  },

  /**
   * @param email
   * @param passHash
   * @param callback
   */
  validateResetLink: function(email, passHash, callback) {
    var filter = {
      $and: [
        {"email": email},
        {"tpass": passHash}
    ]};
    var validate = function(db, cb) {
      db.collection(ACCOUNTS).find(filter).limit(1).next(cb)
    };
    connectAndClose(validate, callback);
  },

  /**
   * @param email
   * @param passHash
   * @param newPass
   * @param callback
   */
  resetPassword: function(email, passHash, newPass, callback) {

    var reset = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      var pwHashes = db.collection(PASSWORDS);

      // Called once the account has been updated.
      var onAccountUpdated = function(err, reply) {
        if (reply.value) {
          var account = reply.value;

          // Final call once the password hash has been
          // updated in the PASSWORDS collection.
          var onHashUpdated = function(err, hashDoc) {
            hashDoc && !err ? cb(null, account) : cb(err);
          };

          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPass, salt, function(err, hash) {

              // Store hash in your password DB.
              var filter = {'user': account.user};
              var update = {$set: {'pw': hash}};
              var options = {returnOriginal: false};
              pwHashes.findOneAndUpdate(filter, update, options, onHashUpdated);

            });
          });

        } else {
          cb(err);
        }
      };

      // Account find and update options.
      var filter = {$and: [
        {"email": email},
        {"tpass": passHash}
      ]};
      var update = {$unset: {'tpass': ''}};
      var options = {returnOriginal: false};
      accounts.findOneAndUpdate(filter, update, options, onAccountUpdated);
    };

    connectAndClose(reset, callback);
  }
};
