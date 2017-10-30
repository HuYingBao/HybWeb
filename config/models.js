/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

    /***************************************************************************
     *                                                                          *
     * Your app's default connection. i.e. the name of one of your app's        *
     * connections (see `config/connections.js`)                                *
     *                                                                          *
     ***************************************************************************/
    connection: 'huyingbaodbAws',

    /***************************************************************************
     *                                                                          *
     * How and whether Sails will attempt to automatically rebuild the          *
     * tables/collections/etc. in your schema.                                  *
     *                                                                          *
     * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
     * safe - never auto-migrate my database(s). I will do it myself (by hand)
     * [不自动合并数据，需要手动控制]
     * alter - auto-migrate, but attempt to keep my existing data (experimental)
     * [与老数据自动合并，当添加新字段后，数据表才会被删除，推荐使用]
     * drop - wipe/drop ALL my data and rebuild models every time I lift Sails
     * [删除数据表，建立新表，插入新数据]
     *                                                                          *
     ***************************************************************************/
    migrate: 'alter',
    autoCreatedAt: true,
    autoUpdatedAt: true
};
