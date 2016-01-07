/**
 * Created by gumm on 2016/01/02.
 */
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/DRAWME';

module.exports = {

  //------------------------------------------------------------[ Some utils ]--
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
  }
};
