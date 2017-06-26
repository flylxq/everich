/**
 * Created by flylxq on 16/9/26.
 */
'user strict';

exports.Cookie = class {
    constructor() {
        this._cookie = this._toObject();
    }

    get cookies() {
        return this._cookie;
    }

    setCookie(key, value) {
        this._cookie[key] = value;
        this._toCookie();
    }

    getCookie(key) {
        return this._cookie[key];
    }

    clearCookie() {
        this._cookie = {};
        this._toCookie();
    }

    _toObject() {
        let cookie = document.cookie.split(';'),
            object = {};
        cookie.forEach(c => {
            let keyValue = c.split('=');
            object[keyValue[0]] = keyValue[1];
        });

        return object;
    }

    _toCookie() {
        var keyValues = [],
            { _cookie } = this;
        for(let key in _cookie) {
            keyValues.push(`${key}=${_cookie[key]}`);
        }

        let cookie = keyValues.join(';');
        document.cookie = cookie;
        return cookie;
    }
}