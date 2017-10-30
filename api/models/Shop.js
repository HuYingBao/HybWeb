/**
 * Shop.js
 *
 * @description :: 商铺
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        shopId: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },

        shopName: {
            type: 'string',
            required: true
        },

        /**
         * 店铺号8位数字
         */
        code: {
            type: 'integer',
            minLength: 8,
            maxLength: 8,
            required: true,
            unique: true
        },

        /**
         *0:服装,1:餐饮,2:服务,3:快递,4:上门,5:其他
         */
        shopType: {
            type: 'integer',
            enum: [0, 1, 2, 3, 4, 5],
            defaultsTo: 0
        },

        headImg: {
            type: 'string'
        },

        shopDesc: {
            type: 'string'
        },

        address: {
            type: 'string'
        },
        longitude: {
            type: 'string',
            required: true
        },

        latitude: {
            type: 'string',
            required: true
        },

        /**
         * 0:顾客可以看全部商品,1:不可以看
         */
        enableShowPro: {
            type: 'integer',
            enum: [0, 1],
            required: true,
            defaultsTo: 0
        },
        /**
         * 0:正常状态,1:禁用状态
         */
        status: {
            type: 'integer',
            enum: [0, 1],
            required: true,
            defaultsTo: 0
        },

        /**
         * (一对多)
         * 店铺成员,位于User表中,所有shopId值为shopId的
         */
        listMember: {
            collection: 'user',
            via: 'shopId'
        },

        /**
         * (一对多)
         */
        listMsgToShop: {
            collection: 'msgToShop',
            via: 'shopId'
        },

        /**
         * (一对多)
         */
        listMsgFromShop: {
            collection: 'msgFromShop',
            via: 'shopId'
        },


        createdAt: {
            type: 'datetime'
        },

        updatedAt: {
            type: 'datetime'
        },
        toJSON: function () {
            var obj = this.toObject();
            //if(!obj.headImg) delete obj.headImg;
            //if(!obj.shopDesc) delete obj.shopDesc;
            //if(!obj.address) delete obj.address;
            CommonService.deleteEmptyProperty(obj);
            return obj;
        }
    }
};

