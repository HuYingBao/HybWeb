/**
 容联云nodeJS调REST
 */
var moment = require('moment');
var md5 = require('MD5'); //MD5模块
var https = require('https');

var accountSid = sails.config.linkedin.y_accountSid;
var authToken = sails.config.linkedin.y_authToken;
var appId = sails.config.linkedin.y_appId;
var senderId = sails.config.linkedin.y_senderId;
var baseHost = sails.config.linkedin.y_baseHost;
var basePort = sails.config.linkedin.y_basePort;

module.exports = {
    /**
     * 创建voipAccount
     * @param name
     * @param callback
     */
    createVoipAccount: function (name, callback) {
        var time = moment().format('YYYYMMDDHHmmss');
        //生成base64格式 Authorization 字符串
        var Authorization = new Buffer(accountSid + ':' + time).toString('base64');
        //生成加密字符串Sig
        var SigParameter = md5(accountSid + authToken + time).toUpperCase();
        //生成全路径url
        var url = '/2013-12-26/Accounts/' + accountSid + '/SubAccounts?sig=' + SigParameter;
        //post数据包
        var data = {'appId': appId, 'friendlyName': name};
        //转JSON为字符串
        data = JSON.stringify(data);
        //POST参数设置
        var opt = {
            method: "POST",
            host: baseHost,
            port: basePort,
            path: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': data.length,
                'Authorization': Authorization
            }
        };
        var req = https.request(opt, function (serverFeedback) {
            if (serverFeedback.statusCode == 200) {
                var body = '';
                serverFeedback.on('data', function (data) {
                    body += data;
                }).on('end', function () { //获取返回数据
                    body = JSON.parse(body);
                    if (body.statusCode == 000000) {
                        callback(200, body.SubAccount);
                    } else {
                        callback(220);
                    }
                });
            } else {
                return callback(serverFeedback.statusCode);
            }
        });
        //发送 POST数据包
        req.write(data);
        //发送结束
        req.end();
    },
    pushMsg: function (json) {
        var json = json || {};
        var data = {
            pushType: json.pushType,
            appId: appId,
            sender: senderId,
            receiver: json.receiver,
            msgType: json.msgType,
            msgContent: json.msgContent,
            msgDomain: json.msgDomain,
            msgFileName: json.msgFileName,
            msgFileUrl: json.msgFileUrl,
        };
        http_request({
            data: data,
            path: 'IM/PushMsg',
            method: 'POST',
            callback: function (data) {
                console.log(data);
                typeof json.callback == 'function' && json.callback(data);
            }
        });
    }
};

function http_request(json) {
    //获取对应格式的时间
    var time = moment().format('YYYYMMDDHHmmss');
    //生成加密字符串Sig
    var SigParameter = md5(accountSid + authToken + time).toUpperCase();
    //生成Authorization
    var Authorization = new Buffer(accountSid + ':' + time).toString('base64');
    //生成json
    var json = json || {};
    //生成json.data
    json.data = json.data || {};
    //从json对象中解析出字符串
    var postData = JSON.stringify(json.data);
    //生成method
    json.method = json.method || 'GET';
    //生成headers
    json.headers = json.headers || {};
    json.headers['Accept'] = 'application/json';
    json.headers['Content-Type'] = 'application/json;charset=utf-8';
    json.headers['Content-Length'] = postData.length;
    json.headers['Authorization'] = Authorization;
    //请求参数
    var options = {
        method: json.method,
        host: baseHost,
        port: basePort,
        path: '/2013-12-26/Accounts/' + accountSid + '/' + json.path + '?sig=' + SigParameter,
        headers: json.headers
    };
    //发送请求
    var req = https.request(options, function (res) {
        var chunks = '';
        res.setEncoding('utf8');//设置返回内容的编码
        //存储返回的响应数据
        res.on('data', function (chunk) {
            chunks += chunk;
        });
        res.on('end', function () {
            //响应完成，获取完整响应数据
            if (typeof json.callback == 'function')
                json.callback(chunks);
        });
    });
    //请求错误时执行的方法
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    // write data to request body
    req.write(postData);//请求体
    req.end();//请求结束
};






