var crypto = require('crypto');
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/DRAWME';

// ---------------------------------------------------------------[ Mongo DB ]--








module.exports = {

  /**
 * @param data
 * @returns {Object.<string, (Object|boolean|string|number)>}
 */
  accountMap: function(data) {
    return {
      profile: {
        name: data.name || null,
        surname: data.surname || null,
        email: data.email || null,
        url: data.url || null,
        location: {
          city: data.city || null,
          country: data.country || null
        },
        contact: {
          phone: data.phone || null,
          mobile: data.mobile || null
        }
      },
      credentials: {
        pass: data.pass || null,
        user: data.user || null
      }
    };
  },

  /**
   * BEWARE: Unless the transform strips this,
   *      the full account with credentials is passed into the callback.
   * @param user
   * @param pass
   * @param callback
   * @param {Function=} opt_transform An optional transform to run the successful
   *      result through before it is passed into the callback.
   */
  autoLogin: function(user, pass, callback, opt_transform) {
    accounts.findOne({'credentials.user': user}, function(err, account) {
      if (account && account.credentials.pass === pass) {
        var result = account;
        if (opt_transform) {
          result = opt_transform(account);
        }
        callback(result);
      } else {
        callback(null);
      }
    });
  },

  /**
   * BEWARE: This passes the account with credentials into the callback.
   * @param user
   * @param pass
   * @param callback
   */
  manualLogin: function(user, pass, callback) {
    var error = {
      user: null,
      pass: null
    };

    var matchUsers = function(db, cb) {
      var accounts = db.collection('accounts');
      accounts.find(
            {"credentials.user": user}
      ).limit(1).next(function(err, doc) {
        db.close();
        if (doc) {
          validatePassword(pass, doc.credentials.pass, function(isValid) {
            if (!isValid) {
              error.pass = 'User password mismatch';
              cb(error);
            } else {
              cb(null, doc);
            }
          })
        } else {
          error.pass = 'User password mismatch';
          cb(error);
        }
      })
    };

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      matchUsers(db, callback);
    });


  },

  addNewAccount: function(newAccount, callback) {
    var targetUName = newAccount.credentials.user;
    var targetPass = newAccount.credentials.pass;
    var targetEmail = newAccount.profile.email;

    /**
     * An error object that maps to the form's field names.
     * @type {{user: (null|string), email: (null|string)}}
     */
    var error = {
      user: null,
      email: null
    };

    /**
     * A method to check that we only store unique user names and emails.
     * @param {Db} db
     * @param {Function} cb
     */
    var insertAccount = function(db, cb) {
      var accounts = db.collection('accounts');

      // See if this username or email already exists
      accounts.find(
          { $or: [
            {"credentials.user": targetUName},
            {"profile.email": targetEmail}
          ]}
      ).limit(1).next(function(err, doc) {

        if (doc && doc.credentials.user == targetUName) {

          // Username is taken...
          db.close();
          error.user = 'This username is not available';
          cb(error, null);

        } else if (doc &&  doc.profile.email == targetEmail) {

          // Email exists...
          db.close();
          error.email = 'This email is already registered. ' +
              'Maybe request a password reset.';
          cb(error, null);

        } else {

          // All OK. Create a password hash
          saltAndHash(targetPass, function(hash) {
            newAccount.credentials.pass = hash;

            // At last. Store the account.
            accounts.insertOne(newAccount, function(err, r) {
              db.close();
              cb(err, r);
            })
          });

        }
      });
    };

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertAccount(db, callback);
    });

  },

  ///**
  // * BEWARE: This passes the account with credentials into the callback.
  // * This does not include changing user names or passwords here.
  // * @param uid
  // * @param newData
  // * @param callback
  // */
  //updateProfile: function(uid, newData, callback) {
  //
  //  var findAndModifyCallback = function(err, account) {
  //    if (err) {
  //      callback(err); // returns error if no matching object found
  //    } else {
  //      callback(null, account);
  //    }
  //  };
  //
  //  accounts.findAndModify(
  //      {_id: BSON.ObjectID(uid)}, // query
  //      [
  //        ['_id', 'asc']
  //      ],           // sort order
  //      {$set: {profile: newData.profile}},
  //      {new: true}, // options new - if set to true, callback function
  //      // returns the modified record.
  //      // Default is false (original record is returned)
  //      findAndModifyCallback
  //  );
  //},
  //
  //updatePassword: function(uid, passwords, callback) {
  //
  //  var pass = passwords.currentPass;
  //  var newPass = passwords.newPass;
  //  var error = {
  //    pass: null,
  //    currpass: null
  //  };
  //
  //  accounts.findOne({_id: BSON.ObjectID(uid)}, function(err, account) {
  //    if (err) {
  //      error.pass = 'Error getting account to update';
  //      callback(err);
  //    } else if (account) {
  //      // Validate the given current password to stored hash
  //      validatePassword(pass, account.credentials.pass, function(isValid) {
  //        if (!isValid) {
  //          error.currpass = 'This is not your current password';
  //          callback(error);
  //        } else {
  //          saltAndHash(newPass, function(hash) {
  //            account.credentials.pass = hash;
  //            accounts.save(account, {safe: true}, function() {
  //              callback(null, account.profile);
  //            });
  //          });
  //        }
  //      });
  //    } else {
  //      error.currpass = 'Could not find the account to update';
  //      callback(err);
  //    }
  //  });
  //},
  //
  ///**
  // * Seeds the account credentials with a new key: 'tpass', and assign a random,
  // * hash as the value. This is used to validate the link sent to the user's
  // * email account when a lost password reset email is sent.
  // * @param email
  // * @param callback
  // */
  //seedAccountWithResetKey: function(email, callback) {
  //  getAccountByEmail(email, function(err, account) {
  //    if (err) {
  //      callback(err, null);
  //    } else {
  //      // Create a simple random number, and salt and hash it.
  //      var rand = Math.floor(Math.random() * 2147483648).toString(36);
  //      saltAndHash(rand, function(hash) {
  //        // Once we have the hash, use it as a temp password.
  //        account.credentials.tpass = hash;
  //        accounts.save(account, {safe: true}, function() {
  //          callback(null, account);
  //        });
  //      });
  //    }
  //  });
  //},
  //
  ///* account lookup methods */
  //deleteAccount: function(id, callback) {
  //  accounts.remove({_id: id}, callback);
  //},
  //
  //getAccountByEmail: function(email, callback) {
  //  var error = {
  //    email: null
  //  };
  //  accounts.findOne({'profile.email': email}, function(e, account) {
  //    if (account === null) {
  //      error.email = 'User not found';
  //      callback(error, null);
  //    } else {
  //      callback(null, account);
  //    }
  //  });
  //},
  //
  //getAccountByUsername: function(user, callback) {
  //  var error = {
  //    user: null
  //  };
  //  accounts.findOne({'credentials.user': user}, function(err, account) {
  //    if (account) {
  //      callback(null, account);
  //    } else {
  //      error.user = 'User not found';
  //      callback(error, null);
  //    }
  //  });
  //},
  //
  //findById: function(id, callback, opt_transform) {
  //  accounts.findOne({_id: getObjectId(id)}, function(err, res) {
  //    if (err) {
  //      callback(err);
  //    } else {
  //      var result = res;
  //      if (opt_transform) {
  //        result = opt_transform(res);
  //      }
  //      callback(null, result);
  //    }
  //  });
  //},
  //
  //validateResetLink:  function(email, passHash, callback) {
  //  accounts.findOne({'profile.email': email, 'credentials.tpass': passHash},
  //      function(e, account) {
  //        if (account) {
  //          callback(null, account);
  //        } else {
  //          callback('Really user not found??', null);
  //        }
  //      });
  //},
  //
  //resetPassword: function(email, passHash, newPass, callback) {
  //  accounts.findOne({'profile.email': email, 'credentials.tpass': passHash},
  //      function(e, account) {
  //        if (account) {
  //          saltAndHash(newPass, function(hash) {
  //            account.credentials = {
  //              pass: hash,
  //              user: account.credentials.user
  //            };
  //            accounts.save(account, {safe: true}, function() {
  //              callback(null, account.profile);
  //            });
  //          });
  //        } else {
  //          callback('Really user not found??', null);
  //        }
  //      });
  //},
  //
  //getAllRecords: function(callback) {
  //  var whenFound = function(e, res) {
  //    if (e) {
  //      callback(e);
  //    } else {
  //      callback(null, res);
  //    }
  //  };
  //  accounts.find().toArray(whenFound);
  //},
  //
  //delAllRecords: function(callback) {
  //  accounts.remove({}, callback); // reset accounts collection for testing //
  //}
};

/* private encryption & validation methods */

var generateSalt = function() {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPURSTUVWXYZ';
  var salt = '';
  for (var i = 0; i < 10; i++) {
    var p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
};

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback) {
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
};

/**
 * For newly created accounts, this converts the given pass field in the
 * given account to a salted hash of the password.
 */
var convertPwToSaltedHash = function(account, newPass, callback) {

  var shCallback = function(hash) {
    account.credentials.pass = hash;
    accounts.insert(account, {safe: true},
        function() {
          callback(null, account.profile);
        }
    );
  };

  saltAndHash(newPass, shCallback);
};

/**
 * Checks that the given user name is unique in the accounts collection.
 * @param {string} username The username to check for uniqueness.
 * @param {function} callback The callback function, should take 2 parameters:
 *      error - The error object if something went wrong with the query.
 *      account - The account - Null if the given username is unique, else the
 *              account that was found with the given username.
 */
var checkUniqueUsername = function(username, callback) {
  accounts.findOne(
      {'credentials.user': username},
      callback
  );
};

var checkUniqueEmail = function(email, callback) {
  accounts.findOne(
      {'profile.email': email},
      callback
  );
};

var validatePassword = function(plainPass, hashedPass, callback) {
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  callback(hashedPass === validHash);
};

/* auxiliary methods */

var getObjectId = function(id) {
  return accounts.db.bson_serializer.ObjectID.createFromHexString(id);
};

var findByMultipleFields = function(a, callback) {
  // this takes an array of name/val pairs to search
  // against {fieldName : 'value'}
  accounts.find({ $or: a }).toArray(
      function(e, results) {
        if (e) {
          callback(e);
        } else {
          callback(null, results);
        }
      });
};
