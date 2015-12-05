goog.provide('app.base.panel.Home');

goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('goog.dom');
goog.require('goog.json');

/**
 * The home panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Home = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.Home, bad.ui.Panel);

app.base.panel.Home.prototype.setMqtt = function(mqtt) {
  this.mqtt = mqtt;
};

app.base.panel.Home.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());

  if (this.dom_.getElement('mapCanvas')) {
    bad.utils.loadGoogleMaps(goog.bind(this.renderMap, this));
  }

  app.base.panel.Home.superClass_.enterDocument.call(this);
};

/**
 * Once google maps is available this is the callback to execute.
 * @param {string=} opt_randName
 */
app.base.panel.Home.prototype.renderMap = function(opt_randName) {
  if (goog.global[opt_randName]) {
    delete goog.global[opt_randName];
  }

  var latLng = new google.maps.LatLng(0, 0);
  var map = new google.maps.Map(document.getElementById('mapCanvas'), {
    zoom: 15,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var marker = new google.maps.Marker({
    position: latLng,
    title: 'Point A',
    map: map,
    draggable: true
  });

  var setPosition = function(payload) {
    latLng = new google.maps.LatLng(payload['lat'], payload['lon']);
    marker.setPosition(latLng);
    map.setCenter(latLng);
  };

  this.getHandler().listen(
    this.mqtt,
    'owntracks/jan/phone',
    function(e) {
      setPosition(goog.json.parse(e.payload));
    }
  );
};
