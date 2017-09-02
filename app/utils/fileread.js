var fs = require("fs");
var HashMap = require("./hashmap");
var xlsx = require('node-xlsx');

//读取文件内容
var fileread = {
    readData : function(filePath) {
        var hashMap =new HashMap.Map();
        var filecount = fs.readdirSync(filePath);
        for(var x = 0; x < filecount.length; x++){
            var filename = filecount[x];
            var k = filename.lastIndexOf(".");
            var SUFFIX="";
            for(k = k+1; k < filename.length; k++) {
                SUFFIX = SUFFIX+filename[k];
            }
            if(SUFFIX == "xls" || SUFFIX == "xlsx") {
                var obj = xlsx.parse(filePath+'/'+filename);
                var excelObj=new Array();
                for(var z = 0; z < obj.length-1 ; z++){
                    excelObj=obj[z].data;
                    for(var i = 4; i < excelObj.length; i++) {
                        hashMap.put(excelObj[i][2], [excelObj[i][3],excelObj[i][6],excelObj[i][14]]);
                    }
                }
            }
            else if(SUFFIX == "csv"){
                var buffer = fs.readFileSync(filePath+'/'+filename);
                var data = buffer.toString();
                rows = data.split("\r\n");
                for(var j = 0; j < (rows.length-1); j++) {
                    var table = rows[j].split(",");
                    hashMap.put(table[2],[table[3],table[6],table[14]]);
                }
            }
            else { console.log("请输入正确的文件类型") }
        }
        return hashMap;
    }
};

module.exports = fileread;
/*function explorer(path){

    fs.readdir(path, function(err, files){
        //err 为错误 , files 文件名列表包含文件夹与文件
        if(err){
            console.log('error:\n' + err);
            return;
        }

        files.forEach(function(file){
            console.log(path+ '/' + file);
            var starTime = new Date();
            var endTime = new Date();
            fileread.readData(path+ '/' + file);
            console.log(endTime.getTime()-starTime.getTime());
            fs.stat(path + '/' + file, function(err, stat){
                if(err){console.log(err); return;}
                if(stat.isDirectory()){
                    // 如果是文件夹遍历
                    explorer(path + '/' + file);
                }else{
                    // 读出所有的文件
                    console.log('文件名:' + path + '/' + file);
                }
            });
        });
    });
}

explorer(path);*/




