/**
 * 用户本人 有权查询
 *
 * 请求query中需要有userId
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    var userId = req.query.userId;
    if (userId && !isNaN(userId) && req.session.passport.user == userId) {
        next();
    } else if (req.session.passport.user != userId) {
        return res.json(216, CommonService.getFailureJson(216));
    } else {
        return res.json(291, CommonService.getFailureJson(291));
    }
};
