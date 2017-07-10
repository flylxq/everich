/**
 * Created by flylxq on 04/07/2017.
 */
import * as querystring from 'querystring';
export class DAO {
    static defaultOptions: any = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    private url: string;

    private errorHandler: any = null;

    constructor(url: string, defaultError?: any) {
        this.url = url;
        this.errorHandler = defaultError;
    }

    public query(options: any, method: string = 'GET', url: string = null): Promise<any> {
        url = url || this.url;
        let opts = Object.assign({}, DAO.defaultOptions);
        opts.method = method;
        if(method === 'GET' || method === 'HEAD') {
            url = `${url}?${querystring.stringify(options)}`;
        } else {
            opts.body = JSON.stringify(options);
        }


        let result = fetch(url, opts).then((rsp: any) => {
            if(!rsp.ok) {
                throw new Error(rsp.status);
            }
            return rsp.json();
        }).then(r => {
            if(!r.success) {
                throw new Error(JSON.stringify(r));
            }
            return r;
        });
        if(this.errorHandler) {
            result.catch(this.errorHandler);
        }
        return result;
    }

    public create(options: any): Promise<any> {
        console.log("options:", options);
        return this.query({
            method: 'create',
            options: JSON.stringify(options)
        });
    }

    public read(options: any = {}): Promise<any> {
        return this.query({
            method: 'read',
            options
        });
    }

    public delete(client: any): Promise<any> {
        return this.query({
            options: JSON.stringify(client),
            method: 'delete'
        });
    }

    public update(options: any = {}): Promise<any> {
        return this.query({
            method: 'update',
            options: JSON.stringify(options)
        });
    }
}