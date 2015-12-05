var helper = require('./helper');
var AM = require('../modules/account-manager');
var countries = require('../constants/countries').list;


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
            helper.makeReplyWith(null, req.session.user.profile));
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
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} err The Error object if any.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(err, account) {
      if (err) {
        res.send(helper.makeReplyWith(err), 400);
      } else {
        req.session.user = account;
        res.status(200).send(helper.makeReplyWith(
            null, account.profile, 'Login Successful'))
      }
    };

    var getCall = function() {
      res.render('login', {});
    };

    var postCall = function() {
      var user = req.body['user'];
      var pass = req.body['pass'];
      AM.manualLogin(user, pass, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  },

  /**
   * @param req
   * @param res
   */
  autoLogin: function(req, res) {
    var noAuto = 'No Auto Login Possible';

    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(account) {
      if (account) {
        req.session.user = account;
        res.status(200)(helper.makeReplyWith(null, account.profile));
      } else {
        res.status(200).send(helper.makeReplyWith(noAuto));
      }
    };

    /**
     * If the session has all the required info to identify a user,
     * use the session info to log in.
     */
    var getCall = function() {
      if (req.session &&
        req.session.user &&
        req.session.user.credentials &&
        req.session.user.credentials.user &&
        req.session.user.credentials.pass) {
        AM.autoLogin(
          req.session.user.credentials.user,
          req.session.user.credentials.pass,
          callback);
      } else {
        res.status(200).send(helper.makeReplyWith(noAuto));
      }
    };

    helper.okGo(req, res, {'GET': getCall});
  },

  /**
   * View the home page
   * @param req
   * @param res
   */
  home: function(req, res) {
    var getCall = function() {
      if (!req.session.user) {
        res.redirect('/');
      } else {
        res.render('home',
            helper.makeReplyWith(null, req.session.user.profile));
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
      var user = AM.accountMap({});
      res.render('user/create', {udata: user.profile});
    };

    var postCall = function() {
      var cleanCountry = req.body['country'] === countries[0].name ?
          null : req.body['country'];
      var newAccount = AM.accountMap({
        name: req.body['name'],
        surname: req.body['surname'],
        email: req.body['email'],
        user: req.body['user'],
        pass: req.body['pass'],
        country: cleanCountry
      });
      var callback = function(err, r) {
        if (err) {
          res.status(400).send(helper.makeReplyWith(err));
        } else {
          var profile = r.ops[0].profile;
          res.status(200).send(helper.makeReplyWith(
              null, profile, 'New account created'));
        }
      };
      AM.addNewAccount(newAccount, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  }


};

