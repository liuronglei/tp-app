/**
 * Created by liurong on 2017/8/14.
 */

const dataformat = {
    report2hex : function(value) {
        var byteArr = dataformat.hex2bytes(value);
        for(var i=byteArr.length-1; i>=0; i--) {
            if(byteArr[i] == 195) {
                byteArr.splice(i,1);
                byteArr[i] +=64;
            } else if(byteArr[i] == 194) {
                byteArr.splice(i,1);
            }
        }
        return dataformat.bytes2hex(byteArr);
    },
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
        var str = "";
            var tmp = num.toString(16);
            if(tmp.length %2 != 0)
            {
                tmp = "0" + tmp;
            }
            str += tmp;
        return str;
    },

    float2bytes : function(value){
        return SingleToHex_Arr(value.toString());
    },
    bytes2float : function(value){
        return HexToSingle(value.reverse().join(" "));
    },
    hex2float : function(value) {
        return HexToSingle(dataformat.bytes2hex(dataformat.hex2bytes(value).reverse()));
    },
    float2bytes2 : function(value){
        return get_float_hex(value.toString());
    },
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



function InsertArray(t, n) {
    var r = new Array();
    for (var i = 0; i * 2 < t.length; i++) {
        r.push(parseInt(t.substr(i * 2, n),16));
    }
    return r;
}
function InsertArray_reverse(t, n) {
    var r = new Array();
    for (var i = 0; i * 2 < t.length; i++) {
        r.push(parseInt(t.substr(i * 2, n),16));
    }
    return r.reverse();
}
function InsertString(t, c, n) {
    var r = new Array();
    for (var i = 0; i * 2 < t.length; i++) {
        r.push(t.substr(i * 2, n));
    }
    return r.join(c);
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
        m = m.substr(0, e + 1) + "." + m.substring(e + 1)
    }
    else {
        m = "0." + FillString(m, "0", m.length - e - 1, true)
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
    var s,
        e,
        m;
    if (t > 0) {
        s = 0;
    }
    else {
        s = 1;
        t = 0 - t;
    }
    m = t.toString(2);
    if (m >= 1) {
        if (m.indexOf(".") == -1) {
            m = m + ".0";
        }
        e = m.indexOf(".") - 1;
    }
    else {
        e = 1 - m.indexOf("1");
    }
    if (e >= 0) {
        m = m.replace(".", "");
    }
    else {
        m = m.substring(m.indexOf("1"));
    }
    if (m.length > 24) {
        m = m.substr(0, 24);
    }
    else {
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
function SingleToHex(t) {
    if (t == "") {
        return "";
    }
    t = parseFloat(t);
    if (isNaN(t) == true) {
        return "Error";
    }
    if (t == 0) {
        return "00000000";
    }
    var s,
        e,
        m;
    if (t > 0) {
        s = 0;
    }
    else {
        s = 1;
        t = 0 - t;
    }
    m = t.toString(2);
    if (m >= 1) {
        if (m.indexOf(".") == -1) {
            m = m + ".0";
        }
        e = m.indexOf(".") - 1;
    }
    else {
        e = 1 - m.indexOf("1");
    }
    if (e >= 0) {
        m = m.replace(".", "");
    }
    else {
        m = m.substring(m.indexOf("1"));
    }
    if (m.length > 24) {
        m = m.substr(0, 24);
    }
    else {
        m = FillString(m, "0", 24, false)
    }
    m = m.substring(1);
    e = (e + 127).toString(2);
    e = FillString(e, "0", 8, true);
    var r = parseInt(s + e + m, 2).toString(16);
    r = FillString(r, "0", 8, true);
    return InsertString(r, "", 2).toUpperCase();
}
function FormatHex(t, n, ie) {
    var r = new Array();
    var s = "";
    var c = 0;
    for (var i = 0; i < t.length; i++) {
        if (t.charAt(i) != " ") {
            s += t.charAt(i);
            c += 1;
            if (c == n) {
                r.push(s);
                s = "";
                c = 0;
            }
        }
        if (ie == false) {
            if ((i == t.length - 1) && (s != "")) {
                r.push(s);
            }
        }
    }
    return r.join("\n");
}
function FormatHexBatch(t, n, ie) {
    var a = t.split("\n");
    var r = new Array();
    for (var i = 0; i < a.length; i++) {
        r[i] = FormatHex(a[i], n, ie);
    }
    return r.join("\n");
}
function HexToSingleBatch(t) {
    var a = FormatHexBatch(t, 8, true).split("\n");
    var r = new Array();
    for (var i = 0; i < a.length; i++) {
        r[i] = HexToSingle(a[i]);
    }
    return r.join("\r\n");
}
function SingleToHexBatch(t) {
    var a = t.split("\n");
    var r = new Array();
    for (var i = 0; i < a.length; i++) {
        r[i] = SingleToHex(a[i]);
    }
    return r.join("\r\n");
}










function DecToBinTail(dec, pad)
{
    var bin = "";
    var i;
    for (i = 0; i < pad; i++)
    {
        dec *= 2;
        if (dec>= 1)
        {
            dec -= 1;
            bin += "1";
        }
        else
        {
            bin += "0";
        }
    }
    return bin;
}
function DecToBinHead(dec,pad)
{
    var bin="";
    var i;
    for (i = 0; i < pad; i++)
    {
        bin = (parseInt(dec % 2).toString()) + bin;
        dec /= 2;
    }
    return bin;
}
function get_float_hex(decString)
{
    var dec = decString;
    var sign;
    var signString;
    var decValue = parseFloat(Math.abs(decString));
    if (decString.toString().charAt(0) == '-')
    {
        sign = 1;
        signString = "1";
    }
    else
    {
        sign = 0;
        signString = "0";
    }
    if (decValue==0)
    {
        fraction = 0;
        exponent = 0;
    }
    else
    {
        var exponent = 127;
        if (decValue>=2)
        {
            while (decValue>=2)
            {
                exponent++;
                decValue /= 2;
            }
        }
        else if (decValue<1)
        {
            while (decValue < 1)
            {
                exponent--;
                decValue *= 2;
                if (exponent ==0)
                    break;
            }
        }
        if (exponent!=0) decValue-=1; else decValue /= 2;

    }
    var fractionString = DecToBinTail(decValue, 23);
    var exponentString = DecToBinHead(exponent, 8);
    return Right('00000000'+parseInt(signString + exponentString + fractionString, 2).toString(16),8);
}
function Right(String, Length)
{
    if (String == null)
        return (false);

    var dest = '';
    for (var i = (String.length - 1); i >= 0; i--)
        dest = dest + String.charAt(i);

    String = dest;
    String = String.substr(0, Length);
    dest = '';

    for (var i = (String.length - 1); i >= 0; i--)
        dest = dest + String.charAt(i);

    return dest;
}



/*
function getFloat(b, index) {
    var l;
    l = b[index + 0];
    l &= 0xff;
    l |= ( b[index + 1] << 8);
    l &= 0xffff;
    l |= ( b[index + 2] << 16);
    l &= 0xffffff;
    l |= ( b[index + 3] << 24);
    return Float.intBitsToFloat(l);
}
*/





