/**
 * MsgFromUser.js
 *
 * @description :: 顾客发送需求消息表
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        /**
         * 主键自增长
         */
        msgFromUserId: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },

        longitude: {
            type: 'string'
        },

        latitude: {
            type: 'string'
        },

        /**
         * 查询半径
         */
        radius: {
            type: 'integer'
        },
        /**
         * 查询区域
         */
        region: {
            type: 'string'
        },

        /**
         *0:服装,1:餐饮,2:服务,3:快递,4:上门,5:其他
         */
        productType: {
            type: 'integer',
            enum: [0, 1, 2, 3, 4, 5],
            defaultsTo: 0
        },

        /**
         *大类中的小类
         */
        contentType: {
            type: 'integer',
            enum: [0, 1, 2, 3, 4, 5],
            defaultsTo: 0
        },
        /**
         * 消息内容
         */
        content: {
            type: 'string'
        },

        /**
         * tag 标签
         */
        tag: {
            type: 'string'
        },

        /**
         * 例图
         */
        img: {
            type: 'string'
        },
        /**
         * 期望价格
         */
        price: {
            type: 'float'
        },

        /**
         * 百度IOS推送ID
         */
        pushIOSMsgId: {
            type: 'string'
        },

        /**
         * 百度Android推送ID
         */
        pushAndroidMsgId: {
            type: 'string'
        },


        /**
         * 0:已经发送,接收到该消息的店家可以回应
         * 1:关闭,接收到该消息的店家不能回应
         */
        status: {
            type: 'integer',
            enum: [0, 1],
            defaultsTo: 0
        },

        /**
         *  (多对一)
         * 该记录属于哪个用户
         */
        userId: {
            model: 'user',
            required: true
        },

        /**
         * (一对多)
         * 对应 店铺回应表
         */
        listMsgFromShop: {
            collection: 'msgFromShop',
            via: 'msgFromUserId'
        },

        /**
         * (一对多)
         * 对应 店铺接收表
         */
        listMsgToShop: {
            collection: 'msgToShop',
            via: 'msgFromUserId'
        },

        createdAt: {
            type: 'datetime'
        },


        updatedAt: {
            type: 'datetime'
        },
        toJSON: function () {
            var obj = this.toObject();
            CommonService.deleteEmptyProperty(obj);
            return obj;
        }
    }
};

