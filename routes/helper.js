/**
 * @type {{
 *    makeErrResponse: Function,
 *    makeCallback: Function,
 *    makeReplyWith: Function,
 *    notSupported: Function,
 *    okGo: Function
 *    }}
 */
module.exports = {
  makeErrResponse: function(code, type, opt_key) {
    var response = [];
    switch (code) {
      case 400:
        response.push('MQTT Client error');
        var message = 'Failed to place request for ' + type;
        message = opt_key ? message + ' (' + opt_key + ')' : message;
        response.push(message);
        break;
      default:
        response.push('Server Error');
        response.push('Something went wrong. Please report');
    }
    return response;
  },

  /**
   * @param {Object} res The express response object.
   * @param {Object} map A map structure like so:
   *  {
   *    '400': ['Error: ', 'Error getting data: '],
   *    '500': ['Server Error', 'Something went wrong'],
   *    '200': {k:v}
   * }
   *
   * @return {Function}
   */
  makeCallback: function(res, map) {
    return function(err, success) {
      if (err) {
        res.status(400).json(this.makeReplyWith(
          map['400'][0] + err, null, map['400'][1]));
      } else if (success) {
        res.status(200).json(map['200']);
      } else {
        res.status(500).json(this.makeReplyWith(
          map['500'][0], null, map['500'][1]));
        console.error('[SRV]', map['500'][1]);
      }
      res.end();
    };
  },

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
  },

  /**
   * Do basic request input parsing. This may later be promoted system wide.
   * @param {Object} req
   * @param {Object} rpc
   * @return {Object}
   */
  parseInput: function(req, rpc) {
    return {
      TID: req.params.TID,
      PID: req.params.PID,
      HID: req.params.HID,
      RPC: rpc
    };
  }

};
