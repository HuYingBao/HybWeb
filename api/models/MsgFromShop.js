/**
 * MsgFromShop.js
 *
 * @description :: 店铺发送回应消息表
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        msgFromShopId: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },

        /**
         * 消息内容
         */
        content: {
            type: 'string'
        },

        /**
         * 消息状态
         * 0:接收到消息,未回复
         * 1:已经回复
         */
        status: {
            type: 'integer',
            enum: [0, 1],
            defaultsTo: 0
        },

        /**
         * 商品图和price一起使用(和productId互斥)
         */
        img: {
            type: 'string'
        },
        /**
         * 商品价格和img一起使用(和productId互斥)
         */
        price: {
            type: 'float'
        },

        /**
         * 店铺中存在的商品(和img,price互斥)
         */
        productId: {
            model: 'product'
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
         * 对应的用户发送需求消息列表
         */
        msgFromUserId: {
            model: 'msgFromUser',
            required: true
        },
        /**
         * (多对一)
         * 对应的用户发送需求消息列表
         */
        msgToShopId: {
            model: 'msgToShop',
            required: true
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

