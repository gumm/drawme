/**
 * Created by gumm on 2015/12/03.
 */
goog.provide('drawme');

goog.require('bad.Net');
goog.require('drawme.Site');
goog.require('goog.net.XhrManager');

/**
 * Init the site
 */
drawme.initSite = function(opt_landing) {

  var opt_maxRetries = 0,
    opt_headers = null,
    opt_minCount = 1,
    opt_maxCount = 6,
    opt_timeoutInterval = 0;

  /**
   * @type {!goog.net.XhrManager}
   */
  var xhrMan = new goog.net.XhrManager(
    opt_maxRetries,
    opt_headers,
    opt_minCount,
    opt_maxCount,
    opt_timeoutInterval);

  /**
   * @type {!bad.Net}
   */
  var xMan = new bad.Net(xhrMan);

  /**
   * @type {drawme.Site}
   */
  var site = new drawme.Site(xMan, opt_landing);
  site.initSite();
};

/**
 * @type {Object}
 * @private
 */
drawme.init_ = {
  'site': drawme.initSite
};
goog.exportSymbol('app_', drawme.init_);


