var helper = require('./helper');
var AccMan = require('../modules/account-manager');
var PicMan = require('../modules/pic-manager');

module.exports = {

  /**
   * The site root.
   * @param req
   * @param res
   */
  slash: function(req, res) {
    var setup = req.app.get('setup');
    var initDetail = {
      title: setup.title,
      theme: setup.theme,
      version: setup.version
    };

    if (setup['jsIsCompiled']) {
      initDetail.jsCompiled = 'compiled/drawme.min.' + setup.version + '.js';
    }
    res.render('index', initDetail);
  },

  /**
   * This is the top bar bits. It really should not need to come here for this.
   * @param req
   * @param res
   */
  header: function(req, res) {
    var getCall = function() {
      if (!req.session.user) {
        res.render('header', {});
      } else {
        res.render('header',
            helper.makeReplyWith(null, req.session.user));
      }
    };
    helper.okGo(req, res, {'GET': getCall});
  },

  /**
   * The non-logged in main page.
   * @param req
   * @param res
   */
  intro: function(req, res) {
    var app = req.app;
    res.render('intro', {title: app.get('title')});
  },


  /**
   * The login panel
   * @param req
   * @param res
   */
  login: function(req, res) {

    /**
     * @param {Object} err The Error object if any.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(err, account) {
      if (err) {
        res.send(helper.makeReplyWith(err), 400);
      } else {
        req.session.user = account;
        res.status(200).send(helper.makeReplyWith(
            null, account, 'Login Successful'))
      }
    };

    var getCall = function() {
      res.render('login', {});
    };

    var postCall = function() {
      var user = req.body['user'];
      var pass = req.body['pass'];
      AccMan.manualLogin(user, pass, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  },

  /**
   * @param req
   * @param res
   */
  autoLogin: function(req, res) {
    if (req.session &&  req.session.user) {
      var account = req.session.user;
      res.status(200).send(helper.makeReplyWith(null, account));
    } else {
      res.status(200).send(helper.makeReplyWith('No Auto Login Possible'));
    }
  },

  logout: function(req, res) {
    var postCall = function() {
      if (req.body['logout'] === 'true') {
        res.clearCookie('user', {});
        res.clearCookie('pass', {});
        req.session.destroy(function() {
          res.status(200).send('ok');
        });
      }
    };
    helper.okGo(req, res, {'POST': postCall});
  },


  /**
   * View the home page
   * @param req
   * @param res
   */
  canvas: function(req, res) {
    var getCall = function() {
      if (!req.session.user) {
        res.redirect('/');
      } else {
        res.render('draw/canvas',
            helper.makeReplyWith(null, req.session.user));
      }
    };
    helper.okGo(req, res, {'GET': getCall});
  },

  panLeft: function(req, res) {
    var getCall = function() {
      if (!req.session.user) {
        res.redirect('/');
      } else {
        res.render('draw/left',
            helper.makeReplyWith(null, req.session.user));
      }
    };
    helper.okGo(req, res, {'GET': getCall});
  },

  panRight: function(req, res) {
    var getCall = function() {
      if (!req.session.user) {
        res.redirect('/');
      } else {
        res.render('draw/right',
            helper.makeReplyWith(null, req.session.user));
      }
    };
    helper.okGo(req, res, {'GET': getCall});
  },


  /**
   * Creates a new account
   * @param req
   * @param res
   */
  signUp: function(req, res) {
    var getCall = function() {
      res.render('user/create', {udata: AccMan.accountMap({})});
    };

    var postCall = function() {
      var clearPW = req.body['pass'];
      var newAccount = AccMan.accountMap({
        name: req.body['name'],
        surname: req.body['surname'],
        email: req.body['email'],
        user: req.body['user']
      });
      var callback = function(err, newUser) {
        if (err) {
          res.status(400).send(helper.makeReplyWith(err));
        } else {
          res.status(200).send(helper.makeReplyWith(
              null, newUser, 'New account created'));
        }
      };
      AccMan.addNewAccount(newAccount, clearPW, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  },

  /**
   * Remove accounts.
   * @param req
   * @param res
   */
  deleteAccount: function(req, res) {
    var confPhrase = 'Please delete my account and all my nice pictures';
    var getCall = function() {
      res.render('user/delete', {confPhrase: confPhrase});
    };

    var onDeleteCallback = function(e) {
      if (!e) {
        res.clearCookie('user', {path: '/'});
        res.clearCookie('pass', {path: '/'});
        req.session.destroy(function() {
          res.status(200).send('Success: Account deleted');
        });
      } else {
        res.status(400).send('Account not found');
      }
    };

    var onGetAccountCallback = function(err, account) {
      if (!account) {
        res.status(400).send(helper.makeReplyWith(err));
      } else {
        AccMan.deleteAccount(account, onDeleteCallback);
      }
    };

    var postCall = function() {
      var user = req.body['user'];
      var pass = req.body['pass'];
      AccMan.manualLogin(user, pass, onGetAccountCallback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  },

  /**
   * @param req
   * @param res
   */
  lostPassword: function(req, res) {
    var settings = req.app.get('setup');
    var transporter = settings.transporter;

    //noinspection JSUnresolvedVariable
    var siteUrl = settings.siteUrl;

    var getCall = function() {
      res.render('lost-password', {});
    };

    var postCall = function() {
      var email = req.body['email'];
      AccMan.seedAccountWithResetKey(email, function(err, accountDoc) {
        if (accountDoc) {

          var account = accountDoc.value;
          var content = composeEmail(account, siteUrl);

          // setup e-mail data with unicode symbols
          var mailOptions = {
            from: "Circles and Squares <explore.iot@gmail.com>",
            to: {
              name: account.name,
              address: account.email
            },
            subject: 'Password Reset Link',
            text: content.txt,
            html: content.html
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
              var errMsg = 'Server Error. No reset email sent. ';
              errMsg = errMsg + 'Message from email server: ' + err;
              res.status(400).send(helper.makeReplyWith({email: errMsg}));
              return console.log(err);
            } else {
              console.log('Message sent: ' + info.response);
              res.status(200).send(helper.makeReplyWith(
                  null,
                  null,
                  'Reset link sent. Please check your email.'
              ));
            }
          });
        } else {
          res.status(400).send(helper.makeReplyWith(err));
        }
      });
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  },

  resetPassword: function(req, res) {

    var getCall = function() {
      var email = req.query["e"];
      var passH = req.query["p"];

      AccMan.validateResetLink(email, passH, function(err, account) {
        if (!account) {
          console.log('Error:', err);
          res.redirect('/');
        } else {
          // save the user's email in a session instead of
          // sending to the client //
          req.session.reset = { email: email, passHash: passH };

          var setup = req.app.get('setup');
          var initDetail = {
            title: setup.title,
            theme: setup.theme,
            version: setup.version,
            landing: 'resetpw',
            user: account.user
          };

          if (setup['jsIsCompiled']) {
            initDetail.jsCompiled = 'compiled/drawme.min.' + setup.version + '.js';
          }
          res.render('resetpassword', initDetail);
        }
      });
    };

    var postCall = function() {
      var nPass = req.body['pass'];
      var email = req.session.reset.email;
      var passH = req.session.reset.passHash;
      req.session.destroy();

      AccMan.resetPassword(email, passH, nPass, function(err, profile) {
        if (profile) {
          res.status(200).send(helper.makeReplyWith(
              null,
              profile,
              'Your password has been reset'
          ));
        } else {
          res.status(400).send(
              helper.makeReplyWith('Unable to update password' + err));
        }
      });
    };
    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  },

  /**
   * Save a picture to the db.
   * @param req
   * @param res
   */
  createPic: function(req, res) {

    var postCall = function() {
      var pic = req.body['svgText'];
      var uid =  req.session.user._id;

      var callback = function(err, reply) {
        if (err) {
          res.status(400).send(helper.makeReplyWith(err));
        } else {
          res.status(200).send(helper.makeReplyWith(
              null, reply, 'Pic Created'));
        }
      };
      PicMan.addNewPic(pic, uid, callback);
    };

    helper.okGo(req, res, {'POST': postCall});
  },

  /**
   * Save a picture to the db.
   * @param req
   * @param res
   */
  updatePic: function(req, res) {

    var postCall = function() {
      var pic = req.body['svgText'];
      var svgId = req.body['svgId'];
      var uid =  req.session.user._id;

      var callback = function(err, reply) {
        if (err) {
          res.status(400).send(helper.makeReplyWith(err));
        } else {
          res.status(200).send(helper.makeReplyWith(
              null, reply, 'Pic Updated'));
        }
      };
      PicMan.updatePic('some name', pic, svgId, uid, callback);
    };

    helper.okGo(req, res, {'POST': postCall});
  },

  /**
   * Save a picture to the db.
   * @param req
   * @param res
   */
  deletePic: function(req, res) {

    var delCall = function() {
      var svgId = req.body['svgId'];
      var uid =  req.session.user._id;

      var callback = function(err, reply) {
        if (err) {
          res.status(400).send(helper.makeReplyWith(err));
        } else {
          res.status(200).send(helper.makeReplyWith(
              null, reply, 'Pic Deleted'));
        }
      };
      PicMan.deletePic(svgId, uid, callback);
    };

    helper.okGo(req, res, {'DELETE': delCall});
  },

  /**
   * Get a list of pictures for this user.
   * @param req
   * @param res
   */
  readPics: function(req, res) {

    var getCall = function() {
      var uid =  req.session.user._id;

      var callback = function(err, pics) {
        if (err) {
          res.status(400).send(helper.makeReplyWith(err));
        } else {
          res.status(200).render('draw/right', {picList: pics})
        }
      };
      PicMan.getPicsForUser(uid, callback);
    };

    helper.okGo(req, res, {'GET': getCall});
  }

};

//-----------------------------------------------------------[ Utility Stuff ]--

/**
 * TODO: Surely we can somehow hook Jade up to do this for us.
 * This is fugly!
 * @param {Object} account
 * @param {String} target
 * @returns {{html: string, txt: string}}
 */
var composeEmail = function(account, target) {
  var link = target + '/pwreset?e=' + account.email +
      '&p=' + account.tpass;
  var html = '<html><body>';
  html += 'Hi ' + account.name + ',<br><br>';
  html += 'Your username is :: <b>' + account.user + '</b><br><br>';
  html += '<a href="' + link + '">Please click here to reset your password' +
      '</a><br><br>';
  html += 'Cheers,<br>';
  html += '<a href="' + target + '">Squares and Circles</a><br><br>';
  html += '</body></html>';

  var txt = 'Hi ' + account.name + '\n';
  txt += 'Your username is :: ' + account.user + '\n\n';
  txt += 'Here is a link that you can reset your password\n\n';
  txt += link +'\n\n';
  txt += 'Cheers,\n';
  txt += 'Squares and Circles';

  return {html:html, txt:txt};
};

