/**
 * Created by flylxq on 16/9/26.
 */
'user strict';

const { DAO } = require('./DAO');
const crypto = require('crypto');

const ERROR_CODE = {
    usernameError: 100001,
    passwordError: 100002,
    correct: 0
};

let ClientDAO = class extends DAO {
    constructor(table) {
        super(table);
    }

    md5(password) {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    getUser(username) {
        const { table } = this;
        console.log(`start to get user for ${username} from ${table}`);
        let sql = `SELECT 
                        * 
                    FROM 
                        ${table} 
                    WHERE 
                        username = "${username}"`;
        return this.query(sql);
    }

    checkUser(username, md5) {
        let self = this;
        return this.getUser(username).then(data => {
            if(data.length === 0) {
                throw new Error(ERROR_CODE.usernameError);
            }
            const {username, power, password, UID} = data[0];
            if(self.md5(password) !== md5) {
                throw new Error(ERROR_CODE.passwordError);
            }

            return {
                username,
                power,
                UID
            };
        });
    }
};

exports.ClientDAO = ClientDAO;