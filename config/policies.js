/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions (`true` allows public     *
     * access)                                                                  *
     *                                                                          *
     ***************************************************************************/

    '*': 'isAuth',

    /***************************************************************************
     *                                                                          *
     * Here's an example of mapping some policies to run before a controller    *
     * and its actions                                                          *
     *                                                                          *
     ***************************************************************************/

    'AuthController': {
        'login': true
    },
    'UserController': {
        'registerUser': true
    },
    'ShopController': {
        'updateShop': ['isAuth', 'isShopManager'],
        'addEmployee': ['isAuth', 'isShopManager'],
        'deleteEmployee': ['isAuth', 'isShopManager']
    },
    'ProductController': {
        'addProduct': ['isAuth', 'isShopManager'],
        'updateProduct': ['isAuth', 'isShopManager']
    }
};
