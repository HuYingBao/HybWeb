var uuid = require('node-uuid');
var bcrypt = require('bcryptjs');
module.exports = {
    /**
     * 创建product
     * @param mProductName
     * @param mShopId
     * @param callback
     */
    createProduct: function (mProductName, mShopId, callback) {
        Product.create({
            productName: mProductName,
            shopId: mShopId,
            uuid: uuid.v4()
        }).exec(function (err, mCreated) {
            if (err == null && mCreated) {
                callback(200, mCreated);
            } else {
                callback(err);
            }
        });
    }
}








