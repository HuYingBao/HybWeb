/**
 * Created by ljf on 2016/1/20 0020.
 */
var crypto = require('crypto'),
    moment = require('moment')
module.exports = {

    /**
     * 删除json中空的数据
     * @param jsonObject
     */
    deleteEmptyProperty: function (jsonObject) {
        for (var i in jsonObject) {
            var value = jsonObject[i];
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    if (value.length == 0) {
                        delete jsonObject[i];
                        continue;
                    }
                }
                CommonService.deleteEmptyProperty(value);
                if (CommonService.isEmpty(value)) {
                    delete jsonObject[i];
                }
            } else {
                if (value === '' || value === null || value === undefined) {
                    delete jsonObject[i];
                }
            }
        }
    },

    /**
     * 删除数组中空元素
     * @param jsonObject
     * @returns {*}
     */
    deleteEmptyItem: function (array) {
        if (array != null && array.length > 0) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == "" || typeof(array[i]) == "undefined") {
                    array.splice(i, 1);
                    i = i - 1;
                }
            }
        }
        return array;
    },


    /**
     * 判空
     * @param object
     * @returns {boolean}
     */
    isEmpty: function (object) {
        for (var name in object) {
            return false;
        }
        return true;
    },

    /**
     * 解密
     * @param cryptkey
     * @param iv
     * @param secretdata
     * @returns {*}
     */
    decodeApp: function (cryptkey, iv, secretdata) {
        var
            decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
            decoded = decipher.update(secretdata, 'base64', 'utf8');

        decoded += decipher.final('utf8');
        return decoded;
    },

    /**
     * 解密
     * @param cryptkey
     * @param iv
     * @param cleardata
     * @returns {*}
     */
    encodeApp: function (cryptkey, iv, cleardata) {
        var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
            encoded = encipher.update(cleardata, 'utf8', 'base64');
        encoded += encipher.final('base64');
        return encoded;
    },

    /**
     * 生成m位随机数,首位不为0,c<=16
     * @param m
     * @returns {*}
     */
    getRandomSmall: function (m) {
        m = m > 16 ? 16 : m;
        var num = Math.random().toString();
        if (num.substr(num.length - m, 1) === '0') {
            return CommonService.getRandomSmall(m);
        }
        return num.substring(num.length - m);
    },
    /**
     * 位数没有限制，首位不为0
     * @param m
     * @returns {string}
     */
    getRandomLarge: function (m) {
        var num = '';
        for (var i = 0; i < m; i++) {
            var val = parseInt(Math.random() * 10, 10);
            if (i === 0 && val === 0) {
                i--;
                continue;
            }
            num += val;
        }
        return num;
    },


    /**
     *  动态生成json
     * @param key
     * @param value
     */
    createJson: function (json, key, value) {
        // 如果 val 被忽略
        if (typeof value === "undefined") {
            // 删除属性
            delete json[key];
        }
        else {
            // 添加 或 修改
            json[key] = value;
        }
    },

    /**
     * stringJson转stringGet
     * @param value
     * @returns {string|XML|*}
     */
    stringJsonToGet: function (value) {
        value = value.replace(/\t/g, "");
        value = value.replace(/\"/g, "").replace("{", "").replace("}", "").replace(",", "&").replace(":", "=");
        value = value.replace(/\"/g, "").replace(/{/g, "").replace(/}/g, "").replace(/,/g, "&").replace(/:/g, "=");
        return value;
    },

    /**
     * 验证130-139,140-149, 150-159,170-179, 180-189号码段的手机号码
     */
    isPhone: function (phone) {
        var regPhone = /^(((13[0-9]{1})|(14[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return regPhone.test(phone);
    },

    /**
     *  TODO 是否是几位数字
     * @param num
     * @param size
     */
    isNum: function (num, size) {
        //var reg = new RegExp("^\d{" + size + "}$");
        var reg = /^\d{8}$/;
        return reg.test(num);
    },

    getResultJson: function (result) {
        return result;
    },

    getFailureJson: function (errorCode) {
        switch (errorCode) {
            case 210:
                return '账户禁用!';
            case 211:
                return '该号码未被注册!';
            case 212:
                return '密码错误!';
            case 213:
                return '该用户已被注册 !';
            case 214:
                return '手机号码不正确!';
            case 215:
                return '密码设置失败!';
            case 216:
                return '您无权查看该用户信息!';
            case 217:
                return '该用户不存在!';

            case 220:
                return '初始化通讯功能失败!';
            case 221:
                return '发送推送失败!';

            case 231:
                return '初始化店铺位置失败!';
            case 232:
                return '该账户已有所属店铺,无法注册新的店铺!';
            case 233:
                return '当前区域没有店铺!';
            case 234:
                return '您不是店员!';
            case 235:
                return '该店铺不存在!';
            case 236:
                return '该店铺被禁用!';
            case 237:
                return '您不是店长!';
            case 238:
                return '您不是该店店长!';
            case 239:
                return '您需要到店中查看所有商品!';
            case 240:
                return '您不是该店店员!';

            case 250:
                return '该商品不存在';

            case 290:
                return '非法请求!';
            case 291:
                return '参数错误!';
            case 292:
                return '服务器错误!';
            case 293:
                return '未被允许!';
            case 294:
                return '未找到!';
            case 295:
                return '参数不能为空!';
            case 296:
                return '用户未登陆!';

            case 299:
            default:
                return '未知错误!';
        }
    }

}
function getJsonGet(text) {
    text = text.split("\n").join(" ");
    var t = [];
    var inString = false;
    for (var i = 0, len = text.length; i < len; i++) {
        var c = text.charAt(i);
        if (inString && c === inString) {
            // TODO: \\"
            if (text.charAt(i - 1) !== '\\') {
                inString = false;
            }
        } else if (!inString && (c === '"' || c === "'")) {
            inString = c;
        } else if (!inString && (c === ' ' || c === "\t")) {
            c = '';
        }
        t.push(c);
    }
    text = t.join('');
    return text;
}

//{
//    or: [{score: {'>': parseInt(theScore),}, status: 'user'}, {status: 'admin'}]
//}

//Model.find({ where: { name: 'foo' }, skip: 20, limit: 10, sort: 'name DESC' });