var soap = require('soap');
const webService = {
    check : function (url,json,callback) {
        soap.createClient(url, function(err, client) {
            client.MESWebService0({inJsonString: json}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                    var resultObj = JSON.parse(result.MESWebService0Result);
                    callback(resultObj);
                }
            });
        })
    },
    upload : function (url,json,callback) {
        soap.createClient(url, function(err, client) {
            client.MESWebService0({inJsonString: json}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                    var resultObj = JSON.parse(result.MESWebService0Result);
                    callback(resultObj);
                }
            });
        })
    }
}

module.exports = webService;






