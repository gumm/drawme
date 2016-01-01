var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/DRAWME';
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
      pass: null
    };

    var matchUsers = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      var pwHashes = db.collection(PASSWORDS);
      accounts.find({'user': user}).limit(1).next(
          function(err, account) {
            if (account) {
              pwHashes.find({'user': account._id}).limit(1).next(
                  function(err, hashDoc) {
                    if (hashDoc) {

                      // Validate a match
                      validatePassword(pass, hashDoc.pw, function(isValid) {
                        if (!isValid) {
                          error.pass = 'User password mismatch.';
                          cb(error);
                        } else {
                          cb(null, account);
                        }
                      });

                    } else {
                      // Password hash not found...
                      // This is a problem
                      cb(error);
                    }
                  }
              )
            } else {
              error.pass = 'User password mismatch';
              cb(error);
            }
          }
      );
    };
    connectCallClose(matchUsers, callback);
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

    /**
     * A method to check that we only store unique user names and emails.
     * @param {Object} db
     * @param {Function} cb
     */
    var insertAccount = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      var pwHashes = db.collection(PASSWORDS);

      // See if this username or email already exists
      accounts.find(
          { $or: [
            {"user": targetUName},
            {"email": targetEmail}
          ]}
      ).limit(1).next(function(err, doc) {
        if (doc && doc.user == targetUName) {
          error.user = 'This username is not available';
          cb(error, null);

        } else if (doc &&  doc.email == targetEmail) {
          error.email = 'This email is already registered. ' +
              'Maybe request a password reset.';
          cb(error, null);

        } else {
          // All OK. Create a password hash
          saltAndHash(targetPass, function(hash) {
            // At last. Store the account and password in their collections.
            accounts.insertOne(newAccount, function(err, r) {
              if (r) {
                var newUser = r.ops[0];
                var pWord = {'user': newUser._id, 'pw': hash};
                pwHashes.insertOne(pWord, function(err, pRes) {
                  cb(err, newUser);
                })
              } else {
                // Email exists...
                cb(error, null);
              }

            })
          });

        }
      });
    };

    connectCallClose(insertAccount, callback);
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

      pwHashes.deleteOne(
          { 'user': account.user },
          function(e, r) {
            if (!e) {
              accounts.deleteOne(
                  { 'user': account.user },
                  function(err, results) {
                    cb(err, results);
                  }
              );
            } else {
              cb('Could not delete account.');
            }
          }
      );
    };

    connectCallClose(removeAccount, callback);
  },

  /**
   * Seeds the account credentials with a new key: 'tpass', and assign a random,
   * hash as the value. This is used to validate the link sent to the user's
   * email account when a lost password reset email is sent.
   * @param email
   * @param callback
   */
  seedAccountWithResetKey: function(email, callback) {

    // Create a simple random number, and salt and hash it.
    var rand = Math.floor(Math.random() * 2147483648).toString(36);

    var seedAccount = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      saltAndHash(rand, function(hash) {

        accounts.findOneAndUpdate(
            {'email': email},
            {$set: {'tpass': hash}}, {
              returnOriginal: false,
              upsert: false
            },
            function(err, account) {
              if (account) {
                cb(null, account);}
              else {
                cb(err);}
            }
        );

      });
    };

    connectCallClose(seedAccount, callback);
  },

  /**
   * @param email
   * @param passHash
   * @param callback
   */
  validateResetLink: function(email, passHash, callback) {

    var validate = function(db, cb) {
      var accounts = db.collection(ACCOUNTS);
      accounts.find(
          { $and: [
            {"email": email},
            {"tpass": passHash}
          ]}
      ).limit(1).next(function(err, doc) {
        if (doc) {
          cb(null, doc);
        } else {
          cb('Really user not found??', null);
        }
      })
    };

    connectCallClose(validate, callback);
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

      saltAndHash(newPass, function(hash) {
        accounts.findOneAndUpdate(
            { $and: [
              {"email": email},
              {"tpass": passHash}
            ]},
            {$unset: {'tpass': ''}}, {
              returnOriginal: false,
              upsert: false
            },
            function(err, accountDoc) {
              if (accountDoc) {
                var account = accountDoc.value;
                pwHashes.findOneAndUpdate(
                    { 'user': account.user },
                    {$set: {'pw': hash}}, {
                      returnOriginal: false,
                      upsert: false
                    },
                    function(err, hashDoc) {
                      if (hashDoc) {
                        cb(null, account);
                      } else {
                        cb(err);
                      }
                    }
                )
              } else {
                cb(err);
              }
            }
        );
      });
    };
    connectCallClose(reset, callback);
  }
};

//--------------------------------------------------------------[ Some utils ]--
var connectCallClose = function(func, callback) {
  MongoClient.connect(url, function(err, db) {
    func(db, function(err, data) {
      if (err) {
        console.log('ERROR:', err);
      }
      db.close();
      callback(err, data)
    });
  });
};


//----------------------------------------------------[ Passwords and Hashes ]--
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

var validatePassword = function(plainPass, hashedPass, callback) {
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  callback(hashedPass === validHash);
};
