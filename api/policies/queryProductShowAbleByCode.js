/**
 * 该店是否允许顾客查看所有商品
 *
 * 请求query中需要传递code
 * eg:http://localhost:1337/product/getProductListByUser/77372769?shopId=1
 * eg:var code = req.param('code');
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    var code = req.query.code;
    //code存在,数字,大于0
    if (code && !isNaN(code) && code > 0) {
        Shop.findOne({code: code}, function (err, shop) {
            if (shop && shop.status == 0 && shop.enableShowPro == 0) {
                delete req.query.code;
                req.query.shopId = shop.shopId;
                return next();
            } else if (!shop) {
                return res.json(235, CommonService.getFailureJson(235));
            } else if (shop.status == 1) {
                return res.json(236, CommonService.getFailureJson(236));
            } else if (shop.enableShowPro == 1) {
                return res.json(239, CommonService.getFailureJson(239));
            } else if (err && !isNaN(err)) {
                return res.json(err, CommonService.getFailureJson(err));
            } else {
                return res.json(299, err);
            }
        });
    } else {
        return res.json(291, CommonService.getFailureJson(291));
    }
};
