/**
 * ProductImg.js
 *
 * @description :: 商品图片
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        imgId: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },

        /**
         * 图片地址
         */
        imgUrl: {
            type: 'string',
            required: true
        },

        /**
         * TODO 当图片不用的时候,批量删除
         * 0:可用
         * 1:不可用,需要删除
         */
        status: {
            type: 'integer',
            enum: [0, 1],
            defaultsTo: 0
        },

        /**
         * 该图片属于的商品ID
         */
        productId: {
            model: 'product',
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

