/**
 * 判断当前操作的人是否是店员
 *
 * POST请求时,会将所在shop传入req中
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    ShopService.getBelongShop(req.session.passport.user, function (err, shop) {
        if (err == 200) {
            if (req.method == "POST") req.body.shopResult = shop;
            return next();
        } else if (!isNaN(err)) {
            return res.json(err, CommonService.getFailureJson(err));
        } else {
            return res.json(299, err);
        }
    });
};
