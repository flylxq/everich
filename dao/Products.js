/**
 * Created by flylxq on 2016/10/28.
 */

const { DAO } = require('../public/javascripts/mysql/DAO');

module.exports = class ProductsDAO extends DAO {
    constructor(options) {
        options = Object.assign({
            table: 'productlist',
            id: 'P_ID'
        }, options || {});
        super(options);
    }

    getProducts(pageSize, pageIndex) {
        return this.getPage(pageSize, pageIndex);
    }

    getProduct(id) {
        return this.read(id);
    }

    removeProduct(id) {
        return this.delete(id);
    }

    updateProduct(product, id) {
        return this.update(product, id);
    }

    insertProduct(product) {
        return this.create(product);
    }
}