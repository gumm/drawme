/**
 * @type {{
 *    makeReplyWith: Function,
 *    notSupported: Function,
 *    okGo: Function
 *    }}
 */
module.exports = {

  /**
   * A generic reply object.
   * @param {?(Object|string)=} opt_err
   * @param {?(Object|string)=} opt_data
   * @param {?string=} opt_message
   * @return {{error: (*|null), data: (*|null), message: (*|null)}}
   */
  makeReplyWith: function(opt_err, opt_data, opt_message) {
    return {
      error: opt_err || null,
      data: opt_data || null,
      message: opt_message || null
    };
  },

  notSupported: function(res) {
    res.status(405).send('Method Not Allowed');
  },

  okGo: function(req, res, obj) {
    if (obj[req.method]) {
      obj[req.method]();
    } else {
      this.notSupported(res);
    }
  }

};
