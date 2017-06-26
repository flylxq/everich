/**
 * Response for json
 */
'use strict';
exports.Response = class {
    constructor(options) {

    }

    static success(data) {
        return {
            success: true,
            data: data,
            message: 'OK'
        }
    }

    static error(err, message) {
        return {
            success: false,
            data: err,
            message: message || 'ERROR'
        }
    }

    static factory(res, promise, key) {
        let self = this
        promise.then(result => {
            res.json(self.success(key ? result[key] : result))
        }).catch(err => {
            res.json(self.error(err))
        })
    }
}