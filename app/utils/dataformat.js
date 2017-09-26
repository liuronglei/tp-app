/**
 * Created by liurong on 2017/8/14.
 */

function InsertArray_reverse(t, n) {
    var r = new Array();
    for (var i = 0; i * 2 < t.length; i++) {
        r.push(parseInt(t.substr(i * 2, n),16));
    }
    return r.reverse();
}
function FillString(t, c, n, b) {
    if ((t == "") || (c.length != 1) || (n <= t.length)) {
        return t;
    }
    var l = t.length;
    for (var i = 0; i < n - l; i++) {
        if (b == true) {
            t = c + t;
        }
        else {
            t += c;
        }
    }
    return t;
}
function HexToSingle(t) {
    t = t.replace(/\s+/g, "");
    if (t == "") {
        return 0;
    }
    if (t == "00000000") {
        return 0;
    }
    if ((t.length > 8) || (isNaN(parseInt(t, 16)))) {
        return -1; //应该是ERROR，但暂时设置成-1，以便跟踪
    }
    if (t.length < 8) {
        t = FillString(t, "0", 8, true);
    }
    t = parseInt(t, 16).toString(2);
    t = FillString(t, "0", 32, true);
    var s = t.substring(0, 1);
    var e = t.substring(1, 9);
    var m = t.substring(9);
    e = parseInt(e, 2) - 127;
    m = "1" + m;
    if (e >= 0) {
        m = m.substr(0, e + 1) + "." + m.substring(e + 1);
    }
    else {
        m = "0." + FillString(m, "0", m.length - e - 1, true);
    }
    if (m.indexOf(".") == -1) {
        m = m + ".0";
    }
    var a = m.split(".");
    var mi = parseInt(a[0], 2);
    var mf = 0;
    for (var i = 0; i < a[1].length; i++) {
        mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
    }
    m = parseInt(mi) + parseFloat(mf);
    if (s == 1) {
        m = 0 - m;
    }
    return m;
}
function SingleToHex_Arr(t) {
    if (t == "") {
        return [0,0,0,0];
    }
    t = parseFloat(t);
    if (isNaN(t) == true) {
        return [0,0,0,0]; //应该是ERROR，但暂时设置成0，以便跟踪
    }
    if (t == 0) {
        return [0,0,0,0];
    }
    var s, e, m;
    if (t > 0) {
        s = 0;
    } else {
        s = 1;
        t = 0 - t;
    }
    m = t.toString(2);
    if (m >= 1) {
        if (m.indexOf(".") == -1) {
            m = m + ".0";
        }
        e = m.indexOf(".") - 1;
    } else {
        e = 1 - m.indexOf("1");
    }
    if (e >= 0) {
        m = m.replace(".", "");
    } else {
        m = m.substring(m.indexOf("1"));
    }
    if (m.length > 24) {
        m = m.substr(0, 24);
    } else {
        m = FillString(m, "0", 24, false)
    }
    m = m.substring(1);
    e = (e + 127).toString(2);
    e = FillString(e, "0", 8, true);
    var r = parseInt(s + e + m, 2).toString(16);
    r = FillString(r, "0", 8, true);
    return InsertArray_reverse(r, 2);
    //return InsertString(r, " ", 2).toUpperCase();
}
//字节数组转十六进制字符串（未反转）
function bytes2hex(arr) {
    var str = "";
    for(var i=0; i<arr.length; i++) {
        var tmp = arr[i].toString(16);
        if(tmp.length == 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}
//字节数组转十六进制字符串（未反转）
function int2hex(num) {
    var str = "";
    var tmp = num.toString(16);
    if(tmp.length %2 != 0) {
        tmp = "0" + tmp;
    }
    str += tmp;
    return str;
}

const dataformat = {
    hex2bytes_r : function (str){
        var pos = 0;
        var len = str.length;
        if(len %2 != 0){
            return null;
        }
        len /= 2;
        var hexA = new Array();
        for(var i=0; i<len; i++) {
            var s = str.substr(pos, 2);
            var v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
        return hexA.reverse();
    },
    //十六进制字符串转浮点数（已反转）
    hex2float_r : function(value) {
        return HexToSingle(bytes2hex(dataformat.hex2bytes_r(value)));
    },
    //十六进制字符串转整数（已反转）
    hex2int_r : function(value) {
        return parseInt(bytes2hex(dataformat.hex2bytes_r(value)),16);
    },
    //浮点数转字节数组（已反转）
    float2bytes_r : function(value){
        return SingleToHex_Arr(value.toString());
    },
    //字节数组转十六进制字符串（已反转）
    int2bytes_r : function (num) {
        return dataformat.hex2bytes_r(int2hex(num));
    },
    /*
    //字节数组转浮点数（已反转）
    bytes2float_r : function(value){
        return HexToSingle(bytes2hex(value.reverse()));
    },
    */
    fillZero : function(num, size) {
        var returnStr = num.toString();
        if(returnStr.length < size) {
            for(var i= returnStr.length; i<size; i++) {
                returnStr = "0" + returnStr;
            }
        }
        return returnStr;
    }
}
module.exports = dataformat;