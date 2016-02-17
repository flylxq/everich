'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pool = undefined;

var _mysql = require('mysql');

var mysql = _interopRequireWildcard(_mysql);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Pool = exports.Pool = mysql.createPool({
    host: '10.101.192.5',
    port: '3306',
    database: 'everich',
    chartset: 'UTF8_GENERAL_CI',
    user: 'alimap',
    password: 'alimap',
    insecureAuth: true,
    connectionLimit: ''
}); /**
     */

//# sourceMappingURL=mysql.js.map