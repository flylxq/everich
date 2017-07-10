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
})

module.exports = router;
