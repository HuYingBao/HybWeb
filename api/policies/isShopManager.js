/**
 * 判断当前操作的人是否是店长,
 *
 * POST请求时,会将所在shop传入req中
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    User.findOne({userId: req.session.passport.user, userType: 1})
        .populate('shopId')
        .exec(function (err, user) {
            if (user && user.shopId && isNaN(user.shopId) && user.shopId.status == 0) {
                if (req.method == "POST") req.body.shopResult = user.shopId;
                return next();
            } else if (!user) {
                return res.json(237, CommonService.getFailureJson(237));
            } else if (!user.shopId || !isNaN(user.shopId)) {
                return res.json(235, CommonService.getFailureJson(235));
            } else if (user.shopId.status != 0) {
                return res.json(236, CommonService.getFailureJson(236));
            } else if (err && !isNaN(err)) {
                return res.json(err, CommonService.getFailureJson(err));
            } else {
                return res.json(299, err);
            }
        });
};
