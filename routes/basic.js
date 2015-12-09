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
  },

  readColors: function(req, res) {

    var getCall = function() {
      res.render('draw/colors', {'colorsMap': {
        "Red50":                         "#FFEBEE",
        "Red100":                        "#FFCDD2",
        "Red200":                        "#EF9A9A",
        "Red300":                        "#E57373",
        "Red400":                        "#EF5350",
        "Red500":                        "#F44336",
        "Red600":                        "#E53935",
        "Red700":                        "#D32F2F",
        "Red800":                        "#C62828",
        "Red900":                        "#B71C1C",
        "RedA100":                       "#FF8A80",
        "RedA200":                       "#FF5252",
        "RedA400":                       "#FF1744",
        "RedA700":                       "#D50000",

        /*------------------------------------------------------ - [ Pink ] --*/
        "Pink50":                        "#FCE4EC",
        "Pink100":                       "#F8BBD0",
        "Pink200":                       "#F48FB1",
        "Pink300":                       "#F06292",
        "Pink400":                       "#EC407A",
        "Pink500":                       "#E91E63",
        "Pink600":                       "#D81B60",
        "Pink700":                       "#C2185B",
        "Pink800":                       "#AD1457",
        "Pink900":                       "#880E4F",
        "PinkA100":                      "#FF80AB",
        "PinkA200":                      "#FF4081",
        "PinkA400":                      "#F50057",
        "PinkA700":                      "#C51162",

        /*-------------------------------------------------------------- [ Purple ] --*/
        "Purple50":                      "#F3E5F5",
        "Purple100":                     "#E1BEE7",
        "Purple200":                     "#CE93D8",
        "Purple300":                     "#BA68C8",
        "Purple400":                     "#AB47BC",
        "Purple500":                     "#9C27B0",
        "Purple600":                     "#8E24AA",
        "Purple700":                     "#7B1FA2",
        "Purple800":                     "#6A1B9A",
        "Purple900":                     "#4A148C",
        "PurpleA100":                    "#EA80FC",
        "PurpleA200":                    "#E040FB",
        "PurpleA400":                    "#D500F9",
        "PurpleA700":                    "#AA00FF",

        /*--------------------------------------------------------- [ Deep Purple ] --*/
        "DeepPurple50":                  "#EDE7F6",
        "DeepPurple100":                 "#D1C4E9",
        "DeepPurple200":                 "#B39DDB",
        "DeepPurple300":                 "#9575CD",
        "DeepPurple400":                 "#7E57C2",
        "DeepPurple500":                 "#673AB7",
        "DeepPurple600":                 "#5E35B1",
        "DeepPurple700":                 "#512DA8",
        "DeepPurple800":                 "#4527A0",
        "DeepPurple900":                 "#311B92",
        "DeepPurpleA100":                "#B388FF",
        "DeepPurpleA200":                "#7C4DFF",
        "DeepPurpleA400":                "#651FFF",
        "DeepPurpleA700":                "#6200EA",

        /*-------------------------------------------------------------- [ Indigo ] --*/
        "Indigo50":                      "#E8EAF6",
        "Indigo100":                     "#C5CAE9",
        "Indigo200":                     "#9FA8DA",
        "Indigo300":                     "#7986CB",
        "Indigo400":                     "#5C6BC0",
        "Indigo500":                     "#3F51B5",
        "Indigo600":                     "#3949AB",
        "Indigo700":                     "#303F9F",
        "Indigo800":                     "#283593",
        "Indigo900":                     "#1A237E",
        "IndigoA100":                    "#8C9EFF",
        "IndigoA200":                    "#536DFE",
        "IndigoA400":                    "#3D5AFE",
        "IndigoA700":                    "#304FFE",

        /*---------------------------------------------------------------- [ Blue ] --*/
        "Blue50":                        "#E3F2FD",
        "Blue100":                       "#BBDEFB",
        "Blue200":                       "#90CAF9",
        "Blue300":                       "#64B5F6",
        "Blue400":                       "#42A5F5",
        "Blue500":                       "#2196F3",
        "Blue600":                       "#1E88E5",
        "Blue700":                       "#1976D2",
        "Blue800":                       "#1565C0",
        "Blue900":                       "#0D47A1",
        "BlueA100":                      "#82B1FF",
        "BlueA200":                      "#448AFF",
        "BlueA400":                      "#2979FF",
        "BlueA700":                      "#2962FF",

        /*---------------------------------------------------------- [ Light Blue ] --*/
        "LightBlue50":                   "#E1F5FE",
        "LightBlue100":                  "#B3E5FC",
        "LightBlue200":                  "#81D4FA",
        "LightBlue300":                  "#4FC3F7",
        "LightBlue400":                  "#29B6F6",
        "LightBlue500":                  "#03A9F4",
        "LightBlue600":                  "#039BE5",
        "LightBlue700":                  "#0288D1",
        "LightBlue800":                  "#0277BD",
        "LightBlue900":                  "#01579B",
        "LightBlueA100":                 "#80D8FF",
        "LightBlueA200":                 "#40C4FF",
        "LightBlueA400":                 "#00B0FF",
        "LightBlueA700":                 "#0091EA",

        /*---------------------------------------------------------------- [ Cyan ] --*/
        "Cyan50":                        "#E0F7FA",
        "Cyan100":                       "#B2EBF2",
        "Cyan200":                       "#80DEEA",
        "Cyan300":                       "#4DD0E1",
        "Cyan400":                       "#26C6DA",
        "Cyan500":                       "#00BCD4",
        "Cyan600":                       "#00ACC1",
        "Cyan700":                       "#0097A7",
        "Cyan800":                       "#00838F",
        "Cyan900":                       "#006064",
        "CyanA100":                      "#84FFFF",
        "CyanA200":                      "#18FFFF",
        "CyanA400":                      "#00E5FF",
        "CyanA700":                      "#00B8D4",

        /*---------------------------------------------------------------- [ Teal ] --*/
        "Teal50":                        "#E0F2F1",
        "Teal100":                       "#B2DFDB",
        "Teal200":                       "#80CBC4",
        "Teal300":                       "#4DB6AC",
        "Teal400":                       "#26A69A",
        "Teal500":                       "#009688",
        "Teal600":                       "#00897B",
        "Teal700":                       "#00796B",
        "Teal800":                       "#00695C",
        "Teal900":                       "#004D40",
        "TealA100":                      "#A7FFEB",
        "TealA200":                      "#64FFDA",
        "TealA400":                      "#1DE9B6",
        "TealA700":                      "#00BFA5",

        /*--------------------------------------------------------------- [ Green ] --*/
        "Green50":                       "#E8F5E9",
        "Green100":                      "#C8E6C9",
        "Green200":                      "#A5D6A7",
        "Green300":                      "#81C784",
        "Green400":                      "#66BB6A",
        "Green500":                      "#4CAF50",
        "Green600":                      "#43A047",
        "Green700":                      "#388E3C",
        "Green800":                      "#2E7D32",
        "Green900":                      "#1B5E20",
        "GreenA100":                     "#B9F6CA",
        "GreenA200":                     "#69F0AE",
        "GreenA400":                     "#00E676",
        "GreenA700":                     "#00C853",

        /*--------------------------------------------------------- [ Light Green ] --*/
        "LightGreen50":                  "#F1F8E9",
        "LightGreen100":                 "#DCEDC8",
        "LightGreen200":                 "#C5E1A5",
        "LightGreen300":                 "#AED581",
        "LightGreen400":                 "#9CCC65",
        "LightGreen500":                 "#8BC34A",
        "LightGreen600":                 "#7CB342",
        "LightGreen700":                 "#689F38",
        "LightGreen800":                 "#558B2F",
        "LightGreen900":                 "#33691E",
        "LightGreenA100":                "#CCFF90",
        "LightGreenA200":                "#B2FF59",
        "LightGreenA400":                "#76FF03",
        "LightGreenA700":                "#64DD17",

        /*---------------------------------------------------------------- [ Lime ] --*/
        "Lime50":                        "#F9FBE7",
        "Lime100":                       "#F0F4C3",
        "Lime200":                       "#E6EE9C",
        "Lime300":                       "#DCE775",
        "Lime400":                       "#D4E157",
        "Lime500":                       "#CDDC39",
        "Lime600":                       "#C0CA33",
        "Lime700":                       "#AFB42B",
        "Lime800":                       "#9E9D24",
        "Lime900":                       "#827717",
        "LimeA100":                      "#F4FF81",
        "LimeA200":                      "#EEFF41",
        "LimeA400":                      "#C6FF00",
        "LimeA700":                      "#AEEA00",

        /*-------------------------------------------------------------- [ Yellow ] --*/
        "Yellow50":                      "#FFFDE7",
        "Yellow100":                     "#FFF9C4",
        "Yellow200":                     "#FFF59D",
        "Yellow300":                     "#FFF176",
        "Yellow400":                     "#FFEE58",
        "Yellow500":                     "#FFEB3B",
        "Yellow600":                     "#FDD835",
        "Yellow700":                     "#FBC02D",
        "Yellow800":                     "#F9A825",
        "Yellow900":                     "#F57F17",
        "YellowA100":                    "#FFFF8D",
        "YellowA200":                    "#FFFF00",
        "YellowA400":                    "#FFEA00",
        "YellowA700":                    "#FFD600",

        /*--------------------------------------------------------------- [ Amber ] --*/
        "Amber50":                       "#FFF8E1",
        "Amber100":                      "#FFECB3",
        "Amber200":                      "#FFE082",
        "Amber300":                      "#FFD54F",
        "Amber400":                      "#FFCA28",
        "Amber500":                      "#FFC107",
        "Amber600":                      "#FFB300",
        "Amber700":                      "#FFA000",
        "Amber800":                      "#FF8F00",
        "Amber900":                      "#FF6F00",
        "AmberA100":                     "#FFE57F",
        "AmberA200":                     "#FFD740",
        "AmberA400":                     "#FFC400",
        "AmberA700":                     "#FFAB00",

        /*-------------------------------------------------------------- [ Orange ] --*/
        "Orange50":                      "#FFF3E0",
        "Orange100":                     "#FFE0B2",
        "Orange200":                     "#FFCC80",
        "Orange300":                     "#FFB74D",
        "Orange400":                     "#FFA726",
        "Orange500":                     "#FF9800",
        "Orange600":                     "#FB8C00",
        "Orange700":                     "#F57C00",
        "Orange800":                     "#EF6C00",
        "Orange900":                     "#E65100",
        "OrangeA100":                    "#FFD180",
        "OrangeA200":                    "#FFAB40",
        "OrangeA400":                    "#FF9100",
        "OrangeA700":                    "#FF6D00",

        /*--------------------------------------------------------- [ Deep Orange ] --*/
        "DeepOrange50":                  "#FBE9E7",
        "DeepOrange100":                 "#FFCCBC",
        "DeepOrange200":                 "#FFAB91",
        "DeepOrange300":                 "#FF8A65",
        "DeepOrange400":                 "#FF7043",
        "DeepOrange500":                 "#FF5722",
        "DeepOrange600":                 "#F4511E",
        "DeepOrange700":                 "#E64A19",
        "DeepOrange800":                 "#D84315",
        "DeepOrange900":                 "#BF360C",
        "DeepOrangeA100":                "#FF9E80",
        "DeepOrangeA200":                "#FF6E40",
        "DeepOrangeA400":                "#FF3D00",
        "DeepOrangeA700":                "#DD2C00",

        /*--------------------------------------------------------------- [ Brown ] --*/
        "Brown50":                       "#EFEBE9",
        "Brown100":                      "#D7CCC8",
        "Brown200":                      "#BCAAA4",
        "Brown300":                      "#A1887F",
        "Brown400":                      "#8D6E63",
        "Brown500":                      "#795548",
        "Brown600":                      "#6D4C41",
        "Brown700":                      "#5D4037",
        "Brown800":                      "#4E342E",
        "Brown900":                      "#3E2723",

        /*---------------------------------------------------------------- [ Grey ] --*/
        "Grey50":                        "#FAFAFA",
        "Grey100":                       "#F5F5F5",
        "Grey200":                       "#EEEEEE",
        "Grey300":                       "#E0E0E0",
        "Grey400":                       "#BDBDBD",
        "Grey500":                       "#9E9E9E",
        "Grey600":                       "#757575",
        "Grey700":                       "#616161",
        "Grey800":                       "#424242",
        "Grey900":                       "#212121",

        /*----------------------------------------------------------- [ Blue Grey ] --*/
        "BlueGrey50":                    "#ECEFF1",
        "BlueGrey100":                   "#CFD8DC",
        "BlueGrey200":                   "#B0BEC5",
        "BlueGrey300":                   "#90A4AE",
        "BlueGrey400":                   "#78909C",
        "BlueGrey500":                   "#607D8B",
        "BlueGrey600":                   "#546E7A",
        "BlueGrey700":                   "#455A64",
        "BlueGrey800":                   "#37474F",
        "BlueGrey900":                   "#263238",

        /*----------------------------------------------------------------- [ B&W ] --*/
        "Black":                         "#000000",
        "White":                         "#FFFFFF",


        /*--------------------------------------------------------------- [ Black ] --*/
        "Black00":                       "#FFFFFF",
        "Black04":                       "#F5F5F5",
        "Black12":                       "#E0E0E0",
        "Black16":                       "#D6D6D6",
        "Black26":                       "#BDBDBD",
        "Black30":                       "#B2B2B2",
        "Black54":                       "#757575",
        "Black69":                       "#4F4F4F",
        "Black87":                       "#212121",
        "Black100":                      "#000000"
      }});
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

