/**
 * MsgToShop.js
 * @description :: 店铺接收需求消息表
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        msgToShopId: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        /**
         * 消息状态
         * 0:未发送成功
         * 1:已发送成功
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
         *  (多对一)
         */
        shopId: {
            model: 'shop',
            required: true
        },

        /**
         * (多对一)
         * 店铺接收消息 对应 用户发送需求消息列表
         */
        msgFromUserId: {
            model: 'msgFromUser',
            required: true
        },

        /**
         * (一对多)
         * 店铺接收消息 对应 店铺回应表
         */
        listMsgFromShop: {
            collection: 'msgFromShop',
            via: 'msgToShopId'
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

