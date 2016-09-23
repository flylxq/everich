/**
 * Created by Xiaoqing Liu
 * 2016/02/16
 *
 * Mysql basic data access object
 */
'use strict';
const { Pool, ProductPool } = require('./mysql');

exports.DAO = class {
    constructor(table) {
        this.Pool = ProductPool;
        this.table = table;
    }

    query(sql, object) {
        let { Pool } = this

        return new Promise(function(resolve, reject){
            let query = Pool.query(sql, object, function(err, result) {
                if(err) {
                    err.object = JSON.stringify(object)
                    err.sql = query.sql
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    create(object) {
        let { table } = this

        let sql = 'INSERT INTO ' + table + ' SET ?'
        return this.query(sql, object)
    }

    update(object) {
        let id = {id: object.id}
        delete object.id
        let { table } = this
        let sql = 'UPDATE ' + table +' SET ? WHERE ?'
        return this.query(sql, [object, id])
    }

    read(id) {
        let { table } = this
        let sql = 'SELECT * FROM ' + table + (id !== undefined ? ' WHERE id = ?' : '')
        return id === undefined ? this.query(sql) : this.query(sql, [id]);
    }

    delete(id) {
        let { table } = this
        let sql = 'DELETE FROM ' + table +' WHERE id = ?'
        return this.query(sql, [id])
    }
}