/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs');
module.exports = {

    attributes: {

        userId: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },

        phone: {
            type: 'string',
            required: true,
            unique: true
        },

        password: {
            type: 'string',
            required: true,
            minLength: 6
        },

        userName: {
            type: 'string',
            defaultsTo: '普通用户'
        },

        /**
         * 0:普通用户,1:店长,2:店员
         */
        userType: {
            type: 'integer',
            enum: [0, 1, 2],
            defaultsTo: 0
        },

        uuid: {
            type: 'string',
            required: true
        },

        voip: {
            type: 'string',
            required: true
        },

        /**
         * 百度推送设备Id
         */
        channelId: {
            type: 'string'
        },

        /**
         * 设备类型
         * 3:android,4:ios
         */
        channelType: {
            type: 'integer',
            enum: [3, 4],
            defaultsTo: 3
        },

        headImg: {
            type: 'string'
        },

        /**
         * 0:男性,1:女性
         */
        sex: {
            type: 'integer',
            enum: [0, 1],
            defaultsTo: 0
        },

        address: {
            type: 'string'
        },

        /**
         * 0:正常状态,1:禁用状态
         */
        status: {
            type: 'integer',
            enum: [0, 1],
            defaultsTo: 0
        },

        /**
         * (多对一)
         * 当前用户所属的店铺
         * 对应shop表中shopId
         * 为0表明不属于任何店铺
         * 设置Shop 的Primary Key 到该位置,
         * 关联shop和user
         */
        shopId: {
            model: 'shop',
            defaultsTo: 0
        },


        /**
         * (一对多)
         */
        listMsgFromUser: {
            collection: 'msgFromUser',
            via: 'userId'
        },

        /**
         * (一对多)
         */
        listMsgToShop: {
            collection: 'msgToShop',
            via: 'userId'
        },

        /**
         * (一对多)
         */
        listMsgFromShop: {
            collection: 'msgFromShop',
            via: 'userId'
        },


        createdAt: {
            type: 'datetime'
        },

        updatedAt: {
            type: 'datetime'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            CommonService.deleteEmptyProperty(obj);
            return obj;
        }
    },

    /**
     * 创建之前,生成加密的password
     * @param user
     * @param cb
     */
    beforeCreate: function (user, cb) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }
};

