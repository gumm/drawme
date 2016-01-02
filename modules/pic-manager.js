var ObjectId = require('mongodb').ObjectID;
var connectAndClose = require('./mongo-helpers').connectAndClose;
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
      });
    };
    connectAndClose(insertPic, callback);
  },

  getPicsForUser: function(uid, callback) {

    var findPics = function(db, cb) {
      db.collection(PICS).find( { "uid": uid } ).limit(10).toArray(
          function(err, docs) {
            cb(err, docs);
          }
      );
    };
    connectAndClose(findPics, callback);
  },

  updatePic: function(name, pic, svgId, uid, callback) {
    var updatePic = function(db, callback) {
       db.collection(PICS).updateOne(
          { "_id" : new ObjectId(svgId) },
          {
            $set: { "svg": pic }
          }, function(err, results) {
          callback(err,results);
       });
    };
    connectAndClose(updatePic, callback);
  },

  deletePic: function(svgId, uid, callback) {
    var deletePic = function(db, callback) {
       db.collection(PICS).deleteOne(
          { "_id" : new ObjectId(svgId) },
          function(err, results) {
          callback(err,results);
       });
    };
    connectAndClose(deletePic, callback);
  }

};

