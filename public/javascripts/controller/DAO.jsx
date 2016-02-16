/**
 */
'use strict'
export default class DAO {
    constructor(url) {
        this.url = url;
    }

    query(options, method) {
        let self = this
        options.method = method
        return $.ajax({
            url: self.url,
            data: options
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