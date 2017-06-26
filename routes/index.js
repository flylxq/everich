/**
 * Created by flylxq on 16/9/23.
 */
'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('layout', { title: 'Everich', mainScript: '/dist/index.js'});
});

module.exports = router;
