/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/
    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *
     ***************************************************************************/

    '/': {
        view: 'homepage'
    },

    /**
     * 店员获取店铺中所有商品，需要传入shopId
     */
    'GET /product/getProductListByEmployee': [
        {policy: 'isAuth'},//必须添加,判断是否是登录用户, blueprint action 会绕过policy.js中的设置
        {policy: 'queryByShop'},//必须是shopId对应店员
        {blueprint: 'find', model: 'product'}
    ],
    /**
     * 顾客查看店铺中所有的商品
     */
    'GET /product/getProductListByUser': [
        {policy: 'isAuth'},
        {policy: 'queryProductShowAbleByCode'},//店铺商品为公开状态
        {blueprint: 'find', model: 'product'}
    ],

    /**
     * 用户获取发送的信息
     */
    'GET /msgFromUser/getSendMessage': [
        {policy: 'isAuth'},
        {policy: 'queryByUser'},
        {blueprint: 'find', model: 'msgfromuser'}
    ],

    /**
     * 店员获取接收的信息
     * @param userId
     * @param skip
     * @param limit
     */
    'GET /msgToShop/getReceiveMessage': [
        {policy: 'isAuth'},
        {policy: 'queryByUser'},
        {blueprint: 'find', model: 'msgtoshop', populate: true}
    ]
};


/**
 * 通过设置路由,跳转到controller中的方法
 */
/*'POST /getShopByLocation': [
 {policy: 'isAuth'},
 {controller: 'shop', action: 'getShopByLocation'}
 ],*/