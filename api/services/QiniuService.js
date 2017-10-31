var qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = sails.config.linkedin.q_ak;
qiniu.conf.SECRET_KEY = sails.config.linkedin.q_sk;

module.exports = {
    /**
     * 生成上传授权token
     * @param bucket
     * @param key
     */
    upToken: function (bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket);
        //有效期当前之间之后6分钟
        putPolicy.deadline = Math.round(new Date().getTime() / 1000) + 360;
        //返回
        putPolicy.returnBody = '{"key": $(key), "hash": $(etag), "width": $(imageInfo.width), "height": $(imageInfo.height)}';
        putPolicy.saveKey = '$(x:partName)_$(x:userId)_$(x:time)';
        //最小10K
        putPolicy.fsizeMin = 10240;
        //最大1024K
        putPolicy.fsizeLimit = 1048576;
        //只允许图片
        putPolicy.mimeLimit = 'image/jpeg';
        return putPolicy.token();
    },
    /**
     * 上传文件
     * @param uptoken
     * @param key
     * @param localFile
     * @param callback
     */
    uploadFile: function (uptoken, key, localFile, callback) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
            var code = 200;
            if (err) {
                switch (err.code) {
                    case -1:
                        code = 211;
                        break;
                    case 403:
                        code = 291;
                        break;
                }
            }
            callback(code, ret);
        });
    }
}
