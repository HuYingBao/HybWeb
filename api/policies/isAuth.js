/**
 * 判断用户是否是登录状态
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.json(296, CommonService.getFailureJson(296));
    }
};
