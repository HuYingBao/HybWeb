/**
 * 该店员 有权查询
 *
 * 请求query中需要传递shopId
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    var shopId = req.query.shopId;
    //shopId存在,数字,大于0
    if (shopId && !isNaN(shopId) && shopId > 0) {
        ShopService.getBelongShop(req.session.passport.user, function (err, shop) {
            if (err == 200 && shopId == shop.shopId) {
                return next();
            } else if (err != 200 && !isNaN(err)) {
                return res.json(err, CommonService.getFailureJson(err));
            } else if (shopId != shop.shopId) {
                return res.json(240, CommonService.getFailureJson(240));
            } else {
                return res.json(299, err);
            }
        });
    } else {
        return res.json(291, CommonService.getFailureJson(291));
    }
};
