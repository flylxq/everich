/**
 * Created by Xiaoqing Liu
 * 2016/02/16
 *
 * Mysql basic data access object
 */
'use strict';
const { Pool, ProductPool } = require('./mysql');
const debug = require('debug')('dao');

exports.DAO = class {
    constructor(options) {
        this.Pool = ProductPool;
        if(typeof options === 'string') {
            this.table = options;
        } else {
            this.table = options.table;
            this.order = options.id;
            this.pageSize = options.pageSize || 100;
        }
    }

    query(sql, object) {
        debug(`DAO ${sql}, ${JSON.stringify(object)}`);
        let { Pool } = this;
        return new Promise(function(resolve, reject){
            let query = Pool.query(sql, object, function(err, result) {
                if(err) {
                    err.object = JSON.stringify(object)
                    err.sql = query.sql
                    reject(err)
                } else {
                    resolve(result)
                }
            });
        });
    }

    getPage(pageSize, pageNum, order) {
        pageSize = pageSize || this.pageSize;
        pageNum = pageNum || 0;
        order = order || this.order || 'id';
        let start = pageSize * pageNum;

        let sql = `SELECT 
                       * 
                   FROM 
                       ${this.table} 
                   ORDER BY 
                       ${order} DESC
                   LIMIT 
                       ${start}, ${pageSize}`;

        let pageSql = `SELECT count(*) AS num FROM ${this.table}`;
        return Promise.all([this.query(sql), this.query(pageSql)]).then(values => {
            let pages = Math.ceil(values[1][0].num / pageSize);
            return {
                list: values[0],
                pages
            };
        });
    }

    create(object) {
        let { table } = this

        let sql = `INSERT INTO ${table} SET ?`;
        return this.query(sql, object)
    }

    update(object, changeId) {
        let id = {id: changeId || object.id};
        delete object.id
        let { table } = this
        let sql = `UPDATE ${table} SET ? WHERE ?`;
        return this.query(sql, [object, id])
    }

    read(id) {
        let { table } = this;
        let sql = 'SELECT * FROM ' + table + (id !== undefined ? ' WHERE id = ?' : '')
        return id === undefined ? this.query(sql) : this.query(sql, [id]);
    }

    search(object) {
        let sql = `SELECT * FROM ${this.table} WHERE ?`;
        return this.query(sql, object);
    }

    delete(id) {
        let { table } = this
        let sql = `DELETE FROM ${table} WHERE id = ?`;
        return this.query(sql, [id]);
    }
}