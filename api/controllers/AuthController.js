/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {

    //_config: {
    //    actions: true,
    //    shortcuts: false,
    //    rest: false
    //},

    /**
     * 登录
     * @param req
     * @param res
     */
    login: function (req, res) {
        if (req.body && req.body.channelId && req.body.channelType) {
            var channelId = req.body.channelId, channelType = req.body.channelType;
            passport.authenticate('local', function (err, user, info) {
                if (user) {
                    req.logIn(user, function (err) {
                        if (err) {
                            return res.json(294, CommonService.getFailureJson(294));
                        } else {
                            User.update({userId: user.userId}, {
                                channelId: channelId,
                                channelType: channelType
                            }).exec(function afterwards(err, updated) {
                                if (err == null && updated && updated[0]) {
                                    return res.json(CommonService.getResultJson(updated[0]));
                                } else if (err && !isNaN(err)) {
                                    return res.json(err, CommonService.getFailureJson(err));
                                } else {
                                    return res.json(299, err);
                                }
                            });
                        }
                    });
                } else if (err == null) {
                    return res.json(294, CommonService.getFailureJson(294));
                } else if (err && !isNaN(err)) {
                    return res.json(err, CommonService.getFailureJson(err));
                } else {
                    return res.json(299, err);
                }
            })(req, res);
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },

    /**
     * 登出
     * @param req
     * @param res
     */
    logout: function (req, res) {
        User.update({userId: req.session.passport.user}, {
            channelId: null,
        }).exec(function afterwards(err, updated) {
            if (err == null && updated && updated[0]) {
                req.logout();
                return res.json(CommonService.getResultJson(true));
            } else if (err && !isNaN(err)) {
                return res.json(err, CommonService.getFailureJson(err));
            } else {
                return res.json(299, err);
            }
        });
    }
};
