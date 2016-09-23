/**
 */
'use strict';
const mysql = require('mysql');

exports.Pool = mysql.createPool({
    host: '10.101.192.5',
    port: '3306',
    database: 'everich',
    chartset: 'UTF8_GENERAL_CI',
    user: 'alimap',
    password: 'alimap',
    insecureAuth: true,
    connectionLimit: ''
});

exports.ProductPool = mysql.createPool({
    host: '42.96.143.214',
    port: '3306',
    database: 'listmg',
    chartset: 'GBK',
    user: 'flylxq',
    password: 'fly5201314',
    insecureAuth: true,
    connectionLimit: ''
});
