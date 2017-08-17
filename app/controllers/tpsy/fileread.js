var fs = require("fs");
var HashMap = require("../../utils/hashmap");
var xlsx = require('node-xlsx');

//读取文件内容
var fileread = {
    readData : function(filePath) {
        var k = filePath.lastIndexOf(".");
        var SUFFIX="";
        for(k = k+1; k < filePath.length; k++) {
            SUFFIX = SUFFIX+filePath[k];
        }
        if(SUFFIX == "xls" || SUFFIX == "xlsx") {
            var obj = xlsx.parse(filePath);
            var excelObj=new Array();
            var hashMap =new HashMap.Map();
            for(var z = 0; z < 5 ; z++){
                excelObj=obj[z].data;
                for(var i = 4; i < excelObj.length; i++) {
                    hashMap.put(excelObj[i][2], [excelObj[i][3],excelObj[i][6],excelObj[i][14]]);
                }
            }
            return hashMap;
        }
        else if(SUFFIX == "csv"){
            var buffer = fs.readFileSync(filePath);
            var data = buffer.toString();
            rows = data.split("\r\n");
            var hashMap = new HashMap.Map();
            for(var j = 0; j < (rows.length-1); j++) {
                var table = rows[j].split(",");
                hashMap.put(table[2],[table[3],table[6],table[14]]);
            }
            return hashMap;
        }
        else { console.log("请输入正确的文件类型") }
    }
};

//console.log(fileread.readData('E:\\天鹏\\app\\data\\Detail_01.csv').size());
//fileread.readData('E:\\天鹏\\app\\data\\Detail_01.csv');
module.exports = fileread;






