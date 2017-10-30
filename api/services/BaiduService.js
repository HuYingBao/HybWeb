var request = require('request');
var crypto = require('crypto');
var bpush = require('bpush-nodejs');
var os = require('os');
var process = require('process');

// 兼容php的urlencode
function fullEncodeURIComponent(str) {
    var rv = encodeURIComponent(str).replace(/[!'()*~]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
    return rv.replace(/\%20/g, '+');
}

/**
 * 生成请求签名
 *
 * @param {object} reqParams, 由url.parse解析出来的对象内容,描述请求的位置和url及参数等信息的对象
 * @param {object} postParams post表单内容
 * @param {string} secretKey 开发者中心的SK
 * @return {string} 签名值
 */
var singKey = function (method, baseurl, postParmas, secretKey) {
    var method = method.toUpperCase();
    var baseurl = baseurl;
    var paramStr = '';
    if (postParmas) {
        var param = {};
        for (var key in postParmas) {
            param[key] = postParmas[key];
        }
        var keys = Object.keys(param).sort();
        keys.forEach(function (key) {
            paramStr += key + "=" + param[key];
        })
    }
    var basekey = method + baseurl + paramStr + secretKey;
    var md5 = crypto.createHash('md5');
    basekey = fullEncodeURIComponent(basekey);
    md5.update(basekey);
    return md5.digest('hex');
}


module.exports = {
    singKey: singKey,

    /**
     * 创建BaiduShop
     * @param dataJson
     * @param callback
     */
    createBaiduShop: function (dataJson, callback) {
        request.post({
            url: 'http://api.map.baidu.com/geodata/v3/poi/create',
            formData: dataJson
        }, function optionalCallback(err, httpResponse, body) {
            if (err || !body) {
                callback(231);
            }
            body = JSON.parse(body);
            if (body.status == 0) {
                callback(200, body)
            } else {
                callback(231)
            }
        });
    },
    /**
     * 根据条件筛选附近店铺
     * @param callback
     * @param dataString
     */
    nearby: function (dataString, callback) {
        request({
            method: 'GET', uri: 'http://api.map.baidu.com/geosearch/v3/nearby?' + dataString, gzip: true
        }, function optionalCallback(err, httpResponse, body) {
            if (err || !body) {
                callback(231);
            }
            body = JSON.parse(body);
            if (body.status == 0) {
                callback(200, body);
            } else {
                callback(231);
            }
        });
    },
    /**
     * 发送推送
     * @param dataJson
     * @param secretKey
     * @param callback
     */
    sendPush: function (dataJson, secretKey, callback) {
        var method = 'post';
        var baseurl = 'https://api.tuisong.baidu.com/rest/3.0/push/batch_device';
        dataJson.sign = singKey(method, baseurl, dataJson, secretKey);
        request({
            method: 'POST',
            url: baseurl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'User-Agent': 'BCCS_SDK/3.0 (' + os.type() + ') node/' + process.version
            },
            form: dataJson
        }, function (err, response, body) {
            if (err || !body) {
                callback(221);
            }
            body = JSON.parse(body);
            if (response.statusCode == 200) {
                callback(200, body)
            } else {
                callback(221)
            }
        });
    }
}