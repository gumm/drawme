var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/DRAWME';
var PICS = 'pics';

/**
 * This takes care of all the DB interactions for an account - a user
 */
module.exports = {

  addNewPic: function(svg, uid, callback) {

    var pic = {
      svg: svg,
      uid: uid
    };

    var insertPic = function(db, cb) {
      var picsCol = db.collection(PICS);

      picsCol.insertOne(pic, function(err, r) {
        if (r) {
          var newPic = r.ops[0];
          cb(err, newPic);
        } else {
          cb('Could not insert PIC in database...', null);
        }
        db.close();
      });
    };

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertPic(db, callback);
    });
  },

  getPicsForUser: function(uid, callback) {

    var findPics = function(db, cb) {
      db.collection(PICS).find( { "uid": uid } ).limit(10).toArray(
          function(err, docs) {
            db.close();
            cb(err, docs);
          }
      );
    };

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      findPics(db, callback);
    });
  },

  updatePic: function(name, pic, svgId, uid, callback) {
    var updatePic = function(db, callback) {
       db.collection(PICS).updateOne(
          { "_id" : new ObjectId(svgId) },
          {
            $set: { "svg": pic }
          }, function(err, results) {
          db.close();
          callback(err,results);
       });
    };

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      updatePic(db, callback);
    });
  },

  deletePic: function(svgId, uid, callback) {
    var deletePic = function(db, callback) {
       db.collection(PICS).deleteOne(
          { "_id" : new ObjectId(svgId) },
          function(err, results) {
          db.close();
          callback(err,results);
       });
    };

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      deletePic(db, callback);
    });
  }

};

