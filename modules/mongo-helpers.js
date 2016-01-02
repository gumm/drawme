/**
 * Created by gumm on 2016/01/02.
 */
var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var url = 'mongodb://localhost:27017/DRAWME';

module.exports = {

  //--------------------------------------------------------------[ Some utils ]--
  connectAndClose: function(func, callback) {
    MongoClient.connect(url, function(err, db) {
      func(db, function(err, data) {
        if (err) {
          console.log('ERROR:', err);
        }
        db.close();
        callback(err, data)
      });
    });
  },

  saltAndHash: function(pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
  },

  validatePassword: function(plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(hashedPass === validHash);
  }

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




