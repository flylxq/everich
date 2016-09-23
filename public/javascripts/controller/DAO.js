/**
 */
'use strict';
import $ from 'jquery';

exports.DAO = class {
    constructor(url) {
        this.url = url;
    }

    query(options, method) {
        let self = this
        return $.ajax({
            url: self.url,
            data: {method: method, options: JSON.stringify(options || {})}
        });
    }

    create(options) {
        return this.query(options, 'create')
    }

    read(options) {
        return this.query(options, 'read')
    }

    delete(id) {
        return this.query({id: id}, 'delete')
    }

    update(options) {
        return this.query(options, 'update')
    }
}