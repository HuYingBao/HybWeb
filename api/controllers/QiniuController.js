/**
 * QiniuController
 *
 * @description :: Server-side logic for managing qinius
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * 获取七牛上传token
     * @param req
     * @param res
     */
    getUpToken: function (req, res) {
        if (req.body && req.body.partName) {
            var key = req.body.partName + "_" + req.session.passport.user + "_" + new Date().getTime();
            var result = QiniuService.upToken(req.body.partName, key);
            return res.json(CommonService.getResultJson(result));
        } else {
            return res.json(290, CommonService.getFailureJson(290));
        }
    },
    uploadFile: function (req, res) {
        if (req.body && req.body.uptoken && req.body.key && req.body.localFile) {
            QiniuService.uploadFile(req.body.uptoken, req.body.key, req.body.localFile, function (err, result) {
                    if (err == 200) {
                        res.json(CommonService.getResultJson(result));
                    } else if (err && !isNaN(err)) {
                        return res.json(err, CommonService.getFailureJson(err));
                    } else {
                        return res.json(299, err);
                    }
                }
            );
        } else {
            res.json(290, CommonService.getFailureJson(290));
        }
    }
};

