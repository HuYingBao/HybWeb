var uuid = require('node-uuid');
var bcrypt = require('bcryptjs');
module.exports = {
    /**
     * 创建user
     * @param mPhone
     * @param mPassword
     * @param callback
     */
    createUser: function (mPhone, mPassword, callback) {
        if (CommonService.isPhone(mPhone)) {
            User.findOne({phone: mPhone}, function (err, user) {
                if (user == null) {
                    var mUuid = uuid.v4();
                    YuntongxunService.createVoipAccount(mUuid, function (resultCode, subAccount) {
                        if (resultCode == 200) {
                            User.create({
                                phone: mPhone,
                                password: mPassword,
                                uuid: mUuid,
                                voip: subAccount.voipAccount
                            }).exec(function (resultCode2, mCreated) {
                                if (resultCode2 == null && mCreated) {
                                    callback(200, mCreated);
                                } else {
                                    callback(err);
                                }
                            });
                        } else {
                            callback(resultCode);
                        }
                    });
                } else if (user) {//自定义操作失败提示
                    callback(213);
                } else {
                    callback(err);
                }
            });
        } else {
            callback(214);
        }
    },
    /**
     * 重置密码
     * @param userId
     * @param oldPassword
     * @param newPassword
     * @param callback
     */
    resetPassword: function (userId, oldPassword, newPassword, callback) {
        User.findOne({userId: userId}, function (err, user) {
            if (user) {
                bcrypt.compare(oldPassword, user.password, function (err, result) {
                    if (result) {
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(newPassword, salt, function (err, hash) {
                                if (err) {
                                    callback(215);
                                } else {
                                    User.update({userId: userId}, {password: hash}).exec(function afterwards(err, updated) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(200);
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        callback(212);
                    }
                });
            } else if (!user) {
                callback(211);
            } else {
                callback(err);
            }
        });
    }
}








