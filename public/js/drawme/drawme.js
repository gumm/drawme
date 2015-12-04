/**
 * Created by gumm on 2015/12/03.
 */
goog.provide('drawme');

//goog.require('bad.Net');
//goog.require('bad.utils');
//goog.require('goog.dom');
//goog.require('goog.net.XhrManager');

/**
 * Init the site
 */
drawme.initSite = function(wsServer, wsPort, landing) {

  console.debug('THE JS STARTED IN THE BROWSER!!!');
  //console.debug(wsServer, wsPort, landing);
  //
  //var opt_maxRetries = 0,
  //  opt_headers = null,
  //  opt_minCount = 1,
  //  opt_maxCount = 6,
  //  opt_timeoutInterval = 0;
  //
  ///**
  // * @type {!goog.net.XhrManager}
  // */
  //var xhrMan = new goog.net.XhrManager(
  //  opt_maxRetries,
  //  opt_headers,
  //  opt_minCount,
  //  opt_maxCount,
  //  opt_timeoutInterval);

  /**
   * @type {!bad.Net}
   */
  //var xMan = new bad.Net(xhrMan);

  /**
   * @type {app.Site}
   */
  //var site = new app.Site(xMan, mqtt, landing);
  //site.initSite();
  //goog.exportSymbol('debugSite', site);
};

/**
 * @type {Object}
 * @private
 */
drawme.init_ = {
  'site': drawme.initSite
};
goog.exportSymbol('app_', drawme.init_);


