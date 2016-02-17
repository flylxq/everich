'use strict';

var _DAO = require('../public/javascripts/mysql/DAO');

var _DAO2 = _interopRequireDefault(_DAO);

var _Response = require('../public/javascripts/common/Response');

var _Response2 = _interopRequireDefault(_Response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

/* GET client page. */
var dao = new _DAO2.default('clients');

var clientServer = function clientServer(req, res, next) {
    var _ref = req.method === 'POST' ? req.body : req.query;

    var method = _ref.method;
    var options = _ref.options;

    options = options ? JSON.parse(options) : null;

    switch (method) {
        case 'create':
            _Response2.default.factory(res, dao.create(options), 'insertId');
            break;
        case 'update':
            _Response2.default.factory(res, dao.update(options), 'changedRows');
            break;
        case 'read':
            _Response2.default.factory(res, dao.read(options.id));
            break;
        case 'delete':
            _Response2.default.factory(res, dao.delete(options.id), 'affectedRows');
            break;
        default:
    }
};

router.get('/', function (req, res, next) {
    res.render('client', { title: 'Client' });
}).all('/server', clientServer);

//router.post('/server', clientServer)
module.exports = router;

//# sourceMappingURL=client.js.map