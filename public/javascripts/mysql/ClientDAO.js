/**
 * Created by flylxq on 16/9/26.
 */
'user strict';

const { DAO } = require('./DAO');

let ClientDAO = class extends DAO {
    constructor(table) {
        super(table);
    }

    getUser(username, password) {
        const { table } = this;
        console.log(`start to get user for ${username}, ${password} from ${table}`);
        let sql = `SELECT 
                        * 
                    FROM 
                        ${table} 
                    WHERE 
                        username = "${username}" 
                        AND password = "${password}"`;
        return this.query(sql);
    }
};

exports.ClientDAO = ClientDAO;