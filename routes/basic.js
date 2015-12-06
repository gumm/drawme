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
      AM.manualLogin(user, pass, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  },

  /**
   * @param req
   * @param res
   */
  autoLogin: function(req, res) {
    console.log('autoLogin attempt');
    if (req.session &&  req.session.user) {
      var account = req.session.user;
      res.status(200).send(helper.makeReplyWith(null, account));
    } else {
      console.log('We just dropped through here because there is no active session', req.session.user);
      res.status(200).send(helper.makeReplyWith('No Auto Login Possible'));
    }
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
    console.log('signUp');
    var getCall = function() {
      res.render('user/create', {udata: AM.accountMap({})});
    };

    var postCall = function() {
      var clearPW = req.body['pass'];
      var newAccount = AM.accountMap({
        name: req.body['name'],
        surname: req.body['surname'],
        email: req.body['email'],
        user: req.body['user']
      });
      var callback = function(err, newUser) {
        console.log('BACK AFTER CREATING THE USER...', newUser);
        if (err) {
          res.status(400).send(helper.makeReplyWith(err));
        } else {
          res.status(200).send(helper.makeReplyWith(
              null, newUser, 'New account created'));
        }
      };
      AM.addNewAccount(newAccount, clearPW, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
  }


};

