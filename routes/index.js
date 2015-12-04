var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var setup = req.app.get('setup');
  var initDetail = {
    title: setup.title,
    theme: setup.theme,
    version: setup.version
  };

  if (setup.jsIsCompiled) {
    initDetail.jsCompiled = 'compiled/drawme.min.' + setup.version + '.js';
  }

  res.render('index', initDetail);
});

module.exports = router;
