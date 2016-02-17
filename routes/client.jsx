var express = require('express');
var router = express.Router();

import DAO from '../public/javascripts/mysql/DAO'
import Response from '../public/javascripts/common/Response'
/* GET client page. */
let dao = new DAO('clients')

let clientServer = function(req, res, next) {
    let { method, options } = (req.method === 'POST' ? req.body : req.query)
    options = options ? JSON.parse(options) : null

    switch(method) {
        case 'create':
            Response.factory(res, dao.create(options), 'insertId')
            break;
        case 'update':
            Response.factory(res, dao.update(options), 'changedRows')
            break;
        case 'read':
            Response.factory(res, dao.read(options.id))
            break;
        case 'delete':
            Response.factory(res, dao.delete(options.id), 'affectedRows')
            break;
        default:
    }
}

router.get('/', function(req, res, next) {
    res.render('client', { title: 'Client' });
})
.all('/server', clientServer);

//router.post('/server', clientServer)
module.exports = router;
