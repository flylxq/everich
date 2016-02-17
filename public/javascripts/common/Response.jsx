/**
 * Response for json
 */
export default class Response {
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
            res.jsonp(self.success(key ? result[key] : result))
        }).catch(err => {
            res.jsonp(self.error(err))
        })
    }
}