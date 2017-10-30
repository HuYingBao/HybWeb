module.exports = {
    /**
     * 创建shop
     * @param shopName
     * @param shopType
     * @param longitude
     * @param latitude
     * @param callback
     */
    createShop: function (shopName, shopType, longitude, latitude, callback) {
        var code = CommonService.getRandomSmall(8);
        var dataJson = {
            longitude: longitude,
            latitude: latitude,
            coord_type: 3,
            geotable_id: sails.config.linkedin.b_geotableId,
            ak: sails.config.linkedin.b_map_ak,
            code: code,
            shopType: shopType
        };
        BaiduService.createBaiduShop(dataJson, function (resultCode, resultData) {
            if (resultCode == 200) {
                Shop.create({
                    shopName: shopName,
                    code: code,
                    shopType: shopType,
                    longitude: longitude,
                    latitude: latitude
                }).exec(function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(200, result);
                    }
                });
            } else {
                callback(resultCode);
            }
        });
    },

    /**
     * 获得所属店铺,可以用来判断是否是店员(包含店长)
     * @param userId
     * @param callback
     */
    getBelongShop: function (userId, callback) {
        User.findOne({userId: userId, userType: {'!': 0}})
            .populate('shopId')
            .exec(function (err, user) {
                if (user && user.shopId && isNaN(user.shopId) && user.shopId.status == 0) {
                    callback(200, user.shopId.toJSON());
                } else if (!user) {
                    callback(234);
                } else if (!user.shopId || !isNaN(user.shopId)) {
                    callback(235);
                } else if (user.shopId.status != 0) {
                    callback(236);
                } else if (err) {
                    callback(err);
                }
            });
    },

    /**
     * 判断shop是否存在
     * @param mShopId
     * @param callback
     */
    isShopExit: function (mShopId, callback) {
        Shop.findOne({shopId: mShopId}, function (err, shop) {
            if (shop) {
                //存在
                callback(true)
            } else {
                //不存在
                callback(false)
            }
        });
    },
    /**
     * 根据shopId获取店铺信息
     * @param shopId
     * @param callback
     */
    getShopById: function (shopId, callback) {
        Shop.findOne({shopId: shopId}, function (err, shop) {
            if (shop) {
                callback(200, shop);
            } else if (!shop) {
                callback(235);
            } else if (err) {
                callback(err);
            }
        });
    }
}








