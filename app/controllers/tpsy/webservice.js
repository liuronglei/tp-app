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
            client.MESWebService2({inJsonString: json}, function (err, result) {
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

/*
var Json_Check = {
    Key : "",
    Role : "",
    TransactionType: 0,
    StarData : "",
    EndData : "",
    InDataSet :[{
        RltBillNo : "SXTZ004971",
        CaseNo : "02781192",
        CapSubGrade : "7",
        PdtGrade : "A5X",
        MachineNo : "4#",
        WorkerNo : "1763"
    }]
};
var json = JSON.stringify(Json_Check);

var Json_Upload = {
    Key: "",      //未使用，为空字符串
    Role: "",      //未使用，为空字符串
    TransactionType: 1,     //校验check:0   数据上传：1
    StartDate: "",//未使用，空字符串
    EndDate: "", //未使用，空字符串
    InDataSet :[{
        LotNo: "TC02 SXTZ004980 1284",     // 批号
        RltBillNo: "SXTZ004980",   //筛选单号
        MachineNo: "6#",  //机台号
        WorkerNo: "1759",  // 工号
        Qty: "228",          //数量
        LevelGrade: "4",         //档位
        CapSubGrade: "8",      //容量档
        Voltage: "3.74-3.78",  //电压
        InterResist: "10-16",       //内阻
        RecordTime: RecordTime,      //时间
        ReTest: "1",      // 二次筛选
        Remark: "XXX"           //    备注
    }]
};
var json2 = JSON.stringify(Json_Upload);
soap.createClient(url, function(err, client) {
    client.MESWebService0({inJsonString:json2},function(err, result) {
        if (err) {
            console.log(err);
        }else {
            console.log(result);
            return result;
        }
    });
});
*/








