/**
 * Created by flylxq on 16/9/23.
 */
/**
 * Created by flylxq on 16/9/23.
 */
'use strict';

const express = require('express');
const router = express.Router();
const { ClientDAO } = require('../public/javascripts/mysql/ClientDAO');
const { Response } = require('../public/javascripts/common/Response');
const { TABLE } = require('../common/constants');
const clientDAO = new ClientDAO(TABLE.users);
router.get('/', function(req, res, next) {
    res.render('layout', { title: 'Login', mainScript: '/dist/login.js'});
}).all('/checkUser', (req, res, next) => {
    let { username, password } = req.query;
    console.log(`check user for ${username} with ${password}`);
    let query = clientDAO.getUser(username, password);
    query.then(data => {
        if(data.length > 0) {
            let { username, UID, power } = data[0];
            res.setHeader('Set-Cookie', [`username=${username}`, `uid=${UID}`, `power=${power}`]);
        }
        res.json(Response.success(data));
    }).catch(error => {
        res.json(Response.error(error));
    });
});

module.exports = router;
