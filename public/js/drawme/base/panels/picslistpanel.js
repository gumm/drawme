goog.provide('app.base.panel.PicsList');

goog.require('app.base.EventType');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.dataset');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.PicsList = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.PicsList, bad.ui.Panel);

app.base.panel.PicsList.prototype.initDom = function() {
  var pics = goog.dom.getElementsByClass('pic-preview', this.getElement());

  goog.array.forEach(pics, function(picEl) {

    // Grab the svg string and convert it to the real thing.
    var svgData = goog.dom.dataset.get(picEl, 'pic');
    goog.dom.dataset.remove(picEl, 'pic');

    //var picId = picEl.id;
    var svg = goog.dom.htmlToDocumentFragment(/** @type {!string} */ (svgData));
    var w = svg.getAttribute('width');
    var h = svg.getAttribute('height');
    var ratio = Math.max(w, h) / 200;
    var smallSvg = svg.cloneNode(true);
    smallSvg.setAttribute('viewBox', '2 2 ' + w * ratio + ' ' + h * ratio);
    smallSvg.removeAttribute('id');
    goog.dom.appendChild(picEl, smallSvg);
    svg.setAttribute('id', picEl.id);

    // Convert the container to a button.
    bad.utils.makeButton(
        picEl, this,
        goog.bind(this.dispatchActionEvent, this,
            app.base.EventType.DRAWING_SELECTED, svg));

  }, this);

};


