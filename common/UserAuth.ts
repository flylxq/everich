/**
 * Created by flylxq on 27/06/2017.
 */
import { ClientDAO } from '../public/javascripts/mysql/ClientDAO.js';
import { Response } from '../public/javascripts/common/Response.js';
import * as Log4js from 'log4js';
const logger = Log4js.getLogger('UserAuth');

class UserAuth {
    static WHITE_LIST: Array<String> = ['/login', '/checkUser'];

    static clientDAO: any = new ClientDAO('userlist');

    static filter(req: any, res: any, next: any): any {
        if(UserAuth.WHITE_LIST.indexOf(req.path) > -1) {
            next();
            return;
        }

        if(req.cookies.username) {
            logger.info(`log in username: ${req.cookies.username}`);
            next();
        } else {
            res.redirect('/login');
        }
    }

    static checkUser(req: any, res: any, next: any): any {
        let { username, password } = req.query;

        UserAuth.clientDAO.checkUser(username, password).then((data: any) => {
            logger.info(`user correct with ${JSON.stringify(data)}`);
            res.json(Response.success(data));
        }).catch((err: any) => {
            logger.error(`check user error: ${err}`);
            res.json(Response.error(err));
        });
    }
}

module.exports = UserAuth;