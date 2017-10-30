/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    /**
     * 注册用户
     * @param req
     * @param res
     */
    registerUser: function (req, res) {
        if (req.body && req.body.phone && req.body.password) {
            var mPhone = req.body.phone, mPassword = req.body.password;
            UserService.createUser(mPhone, mPassword, function (err, mCreated) {
                if (err == 200) {
                    return res.json(CommonService.getResultJson(true));
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
     * 修改用户信息 var user_req = JSON.parse(req.body.user);
     * @param req
     * @param res
     */
    updateUser: function (req, res) {
        if (req.body) {
            var user = {
                userName: req.body.userName,
                headImg: req.body.headImg,
                sex: req.body.sex,
                address: req.body.address
            };
            CommonService.deleteEmptyProperty(user);
            if (!CommonService.isEmpty(user)) {
                User.update({userId: req.session.passport.user}, user).exec(function afterwards(err, updated) {
                    if (err == null && updated && updated[0]) {
                        return res.json(CommonService.getResultJson(true));
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
     * 重置密码
     * @param req
     * @param res
     */
    resetPassword: function (req, res) {
        if (req.body && req.body.oldPassword && req.body.newPassword) {
            var oldPassword = req.body.oldPassword, newPassword = req.body.newPassword;
            var mUserId = req.session.passport.user;
            UserService.resetPassword(mUserId, oldPassword, newPassword, function (err) {
                if (err == 200) {
                    return res.json(CommonService.getResultJson(true));
                } else if (err && !isNaN(err)) {
                    return res.json(err, CommonService.getFailureJson(err));
                } else {
                    return res.json(299, err);
                }
            })
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },

    /**
     *获取用户信息,根据uuid
     * @param req
     * @param res
     */
    getUserByUuid: function (req, res) {
        if (req.query.uuid) {
            User.findOne({uuid: req.query.uuid}, function (err, user) {
                if (user) {
                    return res.json(CommonService.getResultJson(user));
                } else if (!user) {
                    return res.json(217, CommonService.getFailureJson(217));
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
     *获取用户信息,根据phone
     * @param req
     * @param res
     */
    getUserByPhone: function (req, res) {
        if (req.query.phone) {
            User.findOne({phone: req.query.phone}, function (err, user) {
                if (user) {
                    if (user.userType != 0) {
                        ShopService.getShopById(user.shopId, function (err, shop) {
                            if (err == 200) {
                                user.shop=shop;
                                return res.json(CommonService.getResultJson(user));
                            } else if (!isNaN(err)) {
                                return res.json(err, CommonService.getFailureJson(err));
                            } else {
                                return res.json(299, err);
                            }
                        });
                    } else {
                        return res.json(CommonService.getResultJson(user));
                    }
                } else if (!user) {
                    return res.json(217, CommonService.getFailureJson(217));
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