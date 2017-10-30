/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * 添加商品
     * @param req
     * @param res
     */
    addProduct: function (req, res) {
        if (req.body.productName) {
            ProductService.createProduct(req.body.productName, req.body.shopResult.shopId, function (err, mCreated) {
                if (err == 200) {
                    return res.json(CommonService.getResultJson(mCreated));
                } else if (err && !isNaN(err)) {
                    return res.json(err, CommonService.getFailureJson(err));
                } else {
                    return res.json(299, err);
                }
            });
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },

    /**
     * 更新商品信息,包括商品不可用状态
     * policies.js中isShopManager
     * @param req
     * @param res
     */
    updateProduct: function (req, res) {
        if (req.body && req.body.productId) {
            var product = {
                productName: req.body.productName,
                productInfo: req.body.productInfo,
                productType: req.body.productType,
                contentType: req.body.contentType,
                price: req.body.price,
                status: req.body.status
            };
            CommonService.deleteEmptyProperty(product);
            if (!CommonService.isEmpty(product)) {
                Product.update({
                    productId: req.body.productId,
                    shopId: req.body.shopResult.shopId
                }, product).exec(function afterwards(err, updated) {
                    if (updated && updated[0]) {
                        return res.json(CommonService.getResultJson(true));
                    } else if (err == null) {
                        return res.json(294, CommonService.getFailureJson(294));
                    } else if (err && !isNaN(err)) {
                        return res.json(err, CommonService.getFailureJson(err));
                    } else {
                        return res.json(299, err);
                    }
                });
            } else {
                return res.json(295, CommonService.getFailureJson(295));
            }
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },
    /**
     *获取商品信息,根据uuid
     * @param req
     * @param res
     */
    getProductByUuid: function (req, res) {
        if (req.query.uuid) {
            Product.findOne({uuid: req.query.uuid}, function (err, product) {
                if (product) {
                    return res.json(CommonService.getResultJson(product));
                } else if (!product) {
                    return res.json(250, CommonService.getFailureJson(250));
                } else if (err && !isNaN(err)) {
                    return res.json(err, CommonService.getFailureJson(err));
                } else {
                    return res.json(299, err);
                }
            });
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    }
};

