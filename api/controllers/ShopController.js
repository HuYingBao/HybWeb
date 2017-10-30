/**
 * ShopController
 *
 * @description :: Server-side logic for managing shops
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * 注册店铺
     * @param req
     * @param res
     */
    registerShop: function (req, res) {
        if (req.body && req.body.shopName && req.body.longitude && req.body.latitude) {
            var mShopName = req.body.shopName, longitude = req.body.longitude, latitude = req.body.latitude;
            var mShopType = req.body.shopType ? req.body.shopType : 0;//不存在mShopType为0
            var mOwnerId = req.session.passport.user;
            User.findOne({userId: mOwnerId}, function (err, user) {
                    //ownerId存在,是店长,没有所属店铺才给创建店铺
                    if (user && user.userType == 0 && user.shopId == 0) {
                        ShopService.createShop(mShopName, mShopType, longitude, latitude, function (err, shop) {
                                if (err == 200) {//店铺注册成功,需要更新用户表中的店主信息,type:1(店长),shopId:所属店铺!
                                    User.update({userId: mOwnerId}, {
                                        userType: 1,
                                        shopId: shop.shopId
                                    }).exec(function afterwards(err, shop) {
                                        if (user) {
                                            return res.json(CommonService.getResultJson(true));
                                        } else if (err && !isNaN(err)) {
                                            return res.json(err, CommonService.getFailureJson(err));
                                        } else {
                                            return res.json(299, err);
                                        }
                                    });
                                } else if (!isNaN(err)) {
                                    return res.json(err, CommonService.getFailureJson(err));
                                } else {
                                    return res.json(299, err);
                                }
                            }
                        );
                    } else if (!user) {//自定义操作失败提示
                        return res.json(211, CommonService.getFailureJson(211));
                    } else if (user.userType != 0 || user.shopId != 0) {
                        return res.json(232, CommonService.getFailureJson(232));
                    } else if (err && !isNaN(err)) {
                        return res.json(err, CommonService.getFailureJson(err));
                    } else {
                        return res.json(299, err);
                    }
                }
            );
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },
    /**
     * 修改店铺信息
     * @param req
     * @param res
     */
    updateShop: function (req, res) {
        if (req.body) {
            var shop = {
                shopName: req.body.shopName,
                headImg: req.body.headImg,
                shopDesc: req.body.shopDesc
            };
            CommonService.deleteEmptyProperty(shop);
            if (!CommonService.isEmpty(shop)) {
                Shop.update({shopId: req.body.shopResult.shopId}, shop).exec(function afterwards(err, updated) {
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
     * 得到所属店铺
     * @param req
     * @param res
     * @returns {*}
     */
    getBelongShop: function (req, res) {
        ShopService.getBelongShop(req.session.passport.user, function (err, shop) {
            if (err == 200) {
                return res.json(CommonService.getResultJson(shop));
            } else if (!isNaN(err)) {
                return res.json(err, CommonService.getFailureJson(err));
            } else {
                return res.json(299, err);
            }
        });
    },

    /**
     * 获取店铺信息,根据店铺号
     * @param req
     * @param res
     */
    getShopByCode: function (req, res) {
        if (req.query.code) {
            Shop.findOne({code: req.query.code}, function (err, shop) {
                if (shop) {
                    return res.json(CommonService.getResultJson(shop));
                } else if (!shop) {
                    return res.json(235, CommonService.getFailureJson(235));
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
     * TODO 根据地理位置得到周围的店铺
     * @param req
     * @param res
     * @returns {*}
     */
    getShopByLocation: function (req, res) {
        //至少需要longitude,latitude,
        //其他参数自行添加
        if (req.query && req.query.longitude && req.query.latitude) {
            var page_index = req.query.skip / req.query.limit;
            var page_size = req.query.limit;
            var longitude = req.query.longitude;
            var latitude = req.query.latitude;
            var shopType = ( req.query.shopType && !isNaN(req.query.shopType) && req.query.shopType <= 5 && req.query.shopType >= 0)
                ? req.query.shopType
                : 0;
            var radius = ( req.query.radius && !isNaN(req.query.radius) && req.query.radius <= 20000 && req.query.radius >= 1000)
                ? req.query.radius
                : 1000;
            // sortby 格式为sortby={key1}:value1|{key2:val2|key3:val3}。
            // 最多支持16个字段排序 {keyname}:1 升序 {keyname}:-1 降序
            // 以下keyname为系统预定义的： distance 距离排序 weight 权重排序
            // 默认为按weight排序 如果需要自定义排序则指定排序字段
            // 样例：按照价格由便宜到贵排序 sortby=price:1

            // 竖线分隔的多个key-value对key为筛选字段的名称(存储服务中定义)
            // 支持连续区间或者离散区间的筛选：
            // a:连续区间 key:value1,value2
            // b:离散区间 key:[value1,value2,value3,...]
            // 样例: a:连续区间 样例：筛选价格为9.99到19.99并且生产时间为2013年的项
            // price:9.99,19.99|time:2012,2012 b:离散区间 筛选价格为8,9,13，
            // 并且生产时间为2013年的项 price:[8,9,13]|time:2012,2012
            // 注：符号为英文半角中括号
            var dataString = "ak=" + sails.config.linkedin.b_map_ak
                + "&geotable_id=" + sails.config.linkedin.b_geotableId
                + "&location=" + longitude + "," + latitude
                + "&coord_type=3"//3代表百度经纬度坐标系统 4代表百度墨卡托系统
                + "&sortby=distance:1"//排序字段
                + "&radius=" + radius//	检索半径
                + "&filter=shopType:" + shopType
                + "&page_index=" + page_index//分页索引
                + "&page_size=" + page_size;//分页数量
            BaiduService.nearby(dataString, function (err, result) {
                    if (err == 200) {
                        async.map(result.contents,
                            function (itemShopBaidu, callback) {
                                Shop.findOne({code: itemShopBaidu.code}).exec(function (err, shop) {
                                    if (shop) {
                                        shop.distance = itemShopBaidu.distance;
                                    }
                                    callback(err, shop);
                                })
                            },
                            function (err, result) {
                                //数据去除空元素
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i] == "" || typeof(result[i]) == "undefined") {
                                        result.splice(i, 1);
                                        i = i - 1;
                                    }
                                }
                                return res.json(CommonService.getResultJson(result));
                            }
                        );
                    } else if (err && !isNaN(err)) {
                        return res.json(err, CommonService.getFailureJson(err));
                    } else {
                        return res.json(299, err);
                    }
                }
            );
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },

    /**
     * 修改店铺信息 参数:uuid
     * @param req
     * @param res
     */
    addEmployee: function (req, res) {
        if (req.body && req.body.uuid) {
            User.findOne({uuid: req.body.uuid, userType: 0, shopId: 0}, function (err, user) {
                if (user) {
                    var userResult = {
                        shopId: req.body.shopResult.shopId,
                        userType: 2
                    };
                    User.update({uuid: req.body.uuid}, userResult).exec(function afterwards(err, updated) {
                        if (err == null && updated && updated[0]) {
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
            });
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },
    /**
     * 删除员工信息
     * @param req 参数:uuid
     * @param res
     * @returns {*}
     */
    deleteEmployee: function (req, res) {
        if (req.body && req.body.uuid) {
            User.findOne({uuid: req.body.uuid, userType: 2, shopId: req.body.shopResult.shopId}, function (err, user) {
                if (user) {
                    var userResult = {
                        shopId: 0,
                        userType: 0
                    };
                    User.update({uuid: req.body.uuid}, userResult).exec(function afterwards(err, updated) {
                        if (err == null && updated && updated[0]) {
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
            });
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    }
};

