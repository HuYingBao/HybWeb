/**
 * Product.js
 *
 * @description :: 商品
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('node-uuid');
module.exports = {

    attributes: {
        productId: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },

        productName: {
            type: 'string',
            required: true,
            defaultsTo: '商品'
        },

        productInfo: {
            type: 'string'
        },

        uuid: {
            type: 'string',
            required: true
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
         * 商品价格
         */
        price: {
            type: 'float',
            defaultsTo: 0
        },


        /**
         * 0:可见 1:不可见
         */
        status: {
            type: 'integer',
            enum: [0, 1],
            defaultsTo: 0,
            required: true
        },

        /**
         *  (多对一)
         * 当前商品所属的店铺
         * 对应shop表中shopId
         * 设置Shop 的Primary Key 到该位置,
         */
        shopId: {
            model: 'shop',
            required: true
        },


        /**
         * (一对多)
         * 该商品有哪些照片
         * 位于productImg表中,所有productId值为productId的消息
         */
        listProductImg: {
            collection: 'productImg',
            via: 'productId'
        },

        /**
         * (一对多)
         * 该商品在哪些商家回应顾客的消息中
         * 位于MsgFromShop表中,所有productId值为productId的消息
         */
        listSendMsg: {
            collection: 'msgFromShop',
            via: 'productId'
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
/**
 * 创建之前,生成商品的uuid
 * @param product
 * @param next
 */
/*beforeValidate: function (product, next) {
 //如果product已存在则进行下一步
 if (product.productId) {
 next();
 } else {
 product.uuid = uuid.v4();
 next();
 //Shop.findOne(product.shopId).exec(function (err, shop) {
 //    product.type = shop.shopType;
 //    product.uuid = uuid.v4();
 //    next();
 //});
 }
 }*/
