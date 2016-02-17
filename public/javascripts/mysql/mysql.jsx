/**
 */
import * as mysql from 'mysql'

export let Pool = mysql.createPool({
    host: '10.101.192.5',
    port: '3306',
    database: 'everich',
    chartset: 'UTF8_GENERAL_CI',
    user: 'alimap',
    password: 'alimap',
    insecureAuth: true,
    connectionLimit: ''
})
