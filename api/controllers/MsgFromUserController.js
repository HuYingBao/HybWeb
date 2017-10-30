/**
 * MsgFromUserController
 *
 * @description :: Server-side logic for managing msgfromusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * TODO 项当前地理位置半径之内的店铺发送消息
     * @param req
     * @param res
     */
    sendMessageByRadius: function (req, res) {
        //至少需要congtent,longitude,latitude,
        //其他参数自行添加
        if (req.body && req.body.content && req.body.longitude && req.body.latitude) {
            var longitude = req.body.longitude;
            var latitude = req.body.latitude;
            var radius = req.body.radius ? req.body.radius : 1000;
            var region = req.body.region ? req.body.region : null;
            var shopType = req.body.shopType ? req.body.shopType : 0;
            var productType = req.body.productType ? req.body.productType : 0;
            var contentType = req.body.contentType ? req.body.contentType : 0;
            var content = req.body.content;
            var tag = req.body.tag ? req.body.tag : null;
            var img = req.body.img ? req.body.img : null;
            var price = req.body.price ? req.body.price : 0;
            //传给baidu api的参数,用于获取附近的店铺
            var dataString = "ak=" + sails.config.linkedin.b_map_ak
                + "&geotable_id=" + sails.config.linkedin.b_geotableId
                + "&location=" + longitude + "," + latitude
                + "&coord_type=3"
                + "&sortby=distance:1"
                + "&radius=" + radius
                + "&filter=shopType:" + shopType;
            async.auto({
                //创建发送消息msgFromUser
                msgFromUserCreate: function (callback) {
                    MsgFromUser.create({
                        longitude: longitude,
                        latitude: latitude,
                        radius: radius,
                        region: region,
                        productType: productType,
                        contenType: contentType,
                        content: content,
                        tag: tag,
                        img: img,
                        price: price,
                        userId: req.session.passport.user
                    }).exec(function (err, mCreated) {
                        callback(err, mCreated);
                        if (mCreated) {
                            res.json(CommonService.getResultJson(true));
                        } else {
                            sails.log.error('=err MsgFromUser= ', err);
                            res.json(err, CommonService.getFailureJson(err));
                        }
                    });
                },
                //获取接受人list
                receiverList: function (callback) {
                    async.waterfall([
                        async.apply(getBaiduShopNearby, dataString),
                        getShop,
                        getReceivers,
                        getFormatReceivers
                    ], function (err, result) {
                        callback(err, result);
                    });
                    //获取从baidu获取附近的shop
                    function getBaiduShopNearby(dataString, callback) {
                        BaiduService.nearby(dataString, function (err, shopBaiduList) {
                                callback(null, shopBaiduList);
                            }
                        );
                    }

                    //根据baidu返回的数据,获取对应的shop
                    function getShop(shopBaiduList, callback) {
                        async.map(shopBaiduList.contents,
                            function (itemShopBaidu, callback) {
                                Shop.findOne({code: itemShopBaidu.code, status: 0}).exec(function (err, shop) {
                                    if (shop)
                                        callback(null, shop);
                                    else {
                                        callback(null);
                                    }
                                })
                            },
                            function (err, shopList) {
                                callback(null, CommonService.deleteEmptyItem(shopList));
                            }
                        );
                    }

                    //获取店铺中的人
                    function getReceivers(shopList, callback) {
                        async.map(shopList,
                            function (itemShop, callback) {
                                if (itemShop) {
                                    User.find({shopId: itemShop.shopId, status: 0}).exec(function (err, userList) {
                                        callback(null, userList);
                                    })
                                } else {
                                    callback(null, null);
                                }
                            },
                            function (err, userAllList) {
                                callback(null, userAllList);
                            }
                        );
                    }

                    // TODO 需要排除百度chinnalId为空的用户,此处需要优化
                    function getFormatReceivers(userAllList, callback) {
                        var list1 = [];
                        var channelIOSList = [];
                        var channelAndroidList = [];
                        try {
                            userAllList.forEach(function (itemList) {
                                if (itemList) {
                                    itemList.forEach(function (item) {
                                        if (item && item.channelId) {
                                            list1.push(item);
                                            if (item.channelType == 4) {//ios
                                                channelIOSList.push(item.channelId);
                                            } else {//android
                                                channelAndroidList.push(item.channelId);
                                            }
                                        }
                                    });
                                }
                            });
                            var result = {
                                userList: list1,
                                channelIOSList: channelIOSList,
                                channelAndroidList: channelAndroidList
                            }
                            callback(null, result);
                        } catch (err) {
                            callback(null, err);
                        }
                    }
                },
                //发送消息到shop
                seveMsgToShop: ['msgFromUserCreate', 'receiverList', function (callback, results) {
                    var msg = {
                        title: '推送',
                        description: '推送',
                        custom_content: results.msgFromUserCreate
                    };
                    var dataAndroidJson;
                    if (results.receiverList.channelAndroidList != null && results.receiverList.channelAndroidList.length > 0) {
                        dataAndroidJson = {
                            apikey: sails.config.linkedin.b_push_android_ak,
                            timestamp: parseInt((new Date).getTime() / 1000),
                            device_type: 3,
                            channel_ids: JSON.stringify(results.receiverList.channelAndroidList),
                            msg: JSON.stringify(msg)
                        };
                    }
                    var dataIOSJson;
                    if (results.receiverList.channelIOSList != null && results.receiverList.channelIOSList.length > 0) {
                        dataIOSJson = {
                            apikey: sails.config.linkedin.b_push_ios_ak,
                            timestamp: parseInt((new Date).getTime() / 1000),
                            device_type: 4,
                            channel_ids: JSON.stringify(results.receiverList.channelIOSList),
                            msg: JSON.stringify(msg)
                        };
                    }
                    async.parallel([
                            function (callback) {
                                if (dataAndroidJson) {
                                    BaiduService.sendPush(dataAndroidJson, sails.config.linkedin.b_push_android_sk, function (err, result) {
                                            if (err == 200) {
                                                MsgFromUser.update(
                                                    {msgFromUserId: results.msgFromUserCreate.msgFromUserId},
                                                    {pushAndroidMsgId: result.response_params.msg_id}
                                                ).exec(function afterwards(err, updated) {
                                                    callback(err, 'one');
                                                });
                                            } else {
                                                callback(err, 'one');
                                            }
                                        }
                                    );
                                } else {
                                    callback(null, 'one');
                                }
                            },
                            function (callback) {
                                if (dataIOSJson) {
                                    BaiduService.sendPush(dataIOSJson, sails.config.linkedin.b_push_ios_sk, function (err, result) {
                                            if (err == 200) {
                                                MsgFromUser.update(
                                                    {msgFromUserId: results.msgFromUserCreate.msgFromUserId},
                                                    {pushIOSMsgId: result.response_params.msg_id}
                                                ).exec(function afterwards(err, updated) {
                                                    callback(err, 'one');
                                                });
                                            } else {
                                                callback(err, 'one');
                                            }
                                        }
                                    );
                                } else {
                                    callback(null, 'one');
                                }
                            },
                            function (callback) {
                                async.each(results.receiverList.userList, function (receiver, callback) {
                                    MsgToShop.create({
                                        userId: receiver.userId,
                                        shopId: receiver.shopId,
                                        msgFromUserId: results.msgFromUserCreate.msgFromUserId
                                    }).exec(function (err, mCreated) {
                                        callback(err, 'two');
                                    });
                                }, function (err) {
                                    callback(err, 'two')
                                });
                            }
                        ],
                        function (err, results) {
                            callback(err, results)
                        });
                }]
            }, function (err, results) {
                sails.log.error('=err = ', err);
                sails.log.error('=results = ', results);
            });
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    }
};

