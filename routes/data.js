/**
 * Created by flylxq on 2016/10/28.
 */
const express = require('express');
const router = express.Router();
const ProductDAO = require('../dao/Products');
const debug = require('debug')('router:data');
const { Response } = require('../public/javascripts/common/Response');

let productDao = new ProductDAO();
router.post('/products', (req, res, next) => {
    const { id, pageIndex, pageSize } = req.body;
    debug(`Start to get products with id of ${id}.`);
    if(id) {
        Response.factory(res, productDao.getProduct(id));
    } else {
        Response.factory(res, productDao.getProducts(pageSize, pageIndex));
    }
}).post('/products/add', (req, res, next) => {
    const { product } = req.body;
    debug(`Start to add product ${product} in to products.`);
    Response.factory(res, productDao.addProduct(product));
});

module.exports = router;