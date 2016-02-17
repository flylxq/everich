'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Created by Xiaoqing Liu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * 2016/02/16
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Mysql basic data access object
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

var _mysql = require('./mysql');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DAO = (function () {
    function DAO(table) {
        _classCallCheck(this, DAO);

        this.Pool = _mysql.Pool;
        this.table = table;
    }

    _createClass(DAO, [{
        key: 'query',
        value: function query(sql, object) {
            var Pool = this.Pool;

            return new Promise(function (resolve, reject) {
                var query = Pool.query(sql, object, function (err, result) {
                    if (err) {
                        err.object = JSON.stringify(object);
                        err.sql = query.sql;
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        }
    }, {
        key: 'create',
        value: function create(object) {
            var table = this.table;

            var sql = 'INSERT INTO ' + table + ' SET ?';
            return this.query(sql, object);
        }
    }, {
        key: 'update',
        value: function update(object) {
            var id = { id: object.id };
            delete object.id;
            var table = this.table;

            var sql = 'UPDATE ' + table + ' SET ? WHERE ?';
            return this.query(sql, [object, id]);
        }
    }, {
        key: 'read',
        value: function read(id) {
            var table = this.table;

            var sql = 'SELECT * FROM ' + table + (id !== undefined ? ' WHERE id = ?' : '');
            return this.query(sql, [id]);
        }
    }, {
        key: 'delete',
        value: function _delete(id) {
            var table = this.table;

            var sql = 'DELETE FROM ' + table + ' WHERE id = ?';
            return this.query(sql, [id]);
        }
    }]);

    return DAO;
})();

exports.default = DAO;

//# sourceMappingURL=DAO.js.map