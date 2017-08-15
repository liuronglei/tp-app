/**
 * Created by liurong on 2017/8/14.
 */

const dataformat = {
    //十六进制字符串转字节数组
    hex2bytes : function (str){
        var pos = 0;
        var len = str.length;
        if(len %2 != 0){
            return null;
        }
        len /= 2;
        var hexA = new Array();
        for(var i=0; i<len; i++)
        {
            var s = str.substr(pos, 2);
            var v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
        return hexA;
    },
    //字节数组转十六进制字符串
    bytes2hex : function (arr) {
        var str = "";
        for(var i=0; i<arr.length; i++)
        {
            var tmp = arr[i].toString(16);
            if(tmp.length == 1)
            {
                tmp = "0" + tmp;
            }
            str += tmp;
        }
        return str;
    },
    //字节数组转十六进制字符串
    int2hex : function (num) {
            var tmp = num.toString(16);
            if(tmp.length == 1)
            {
                tmp = "0" + tmp;
            }
            str += tmp;
        return str;
    }
}
module.exports = dataformat;