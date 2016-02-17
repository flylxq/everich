/**
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DAO = (function () {
    function DAO(url) {
        _classCallCheck(this, DAO);

        this.url = url;
    }

    _createClass(DAO, [{
        key: 'query',
        value: function query(options, method) {
            var self = this;
            return $.ajax({
                url: self.url,
                data: { method: method, options: JSON.stringify(options || {}) }
            });
        }
    }, {
        key: 'create',
        value: function create(options) {
            return this.query(options, 'create');
        }
    }, {
        key: 'read',
        value: function read(options) {
            return this.query(options, 'read');
        }
    }, {
        key: 'delete',
        value: function _delete(id) {
            return this.query({ id: id }, 'delete');
        }
    }, {
        key: 'update',
        value: function update(options) {
            return this.query(options, 'update');
        }
    }]);

    return DAO;
})();

exports.default = DAO;

//# sourceMappingURL=DAO.js.map