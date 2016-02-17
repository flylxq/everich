'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Response for json
 */

var Response = (function () {
    function Response(options) {
        _classCallCheck(this, Response);
    }

    _createClass(Response, null, [{
        key: 'success',
        value: function success(data) {
            return {
                success: true,
                data: data,
                message: 'OK'
            };
        }
    }, {
        key: 'error',
        value: function error(err, message) {
            return {
                success: false,
                data: err,
                message: message || 'ERROR'
            };
        }
    }, {
        key: 'factory',
        value: function factory(res, promise, key) {
            var self = this;
            promise.then(function (result) {
                res.jsonp(self.success(key ? result[key] : result));
            }).catch(function (err) {
                res.jsonp(self.error(err));
            });
        }
    }]);

    return Response;
})();

exports.default = Response;

//# sourceMappingURL=Response.js.map