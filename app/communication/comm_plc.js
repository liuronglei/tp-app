/**
 * Created by liurong on 2017/8/10.
 */

const service = require("../communication/plc_service");
const client = require("../communication/plc_client");
var dataformat = require('../utils/dataformat');
const message_base_write = [
    0x50,0x00,//副帧头 0-1
    0x00,//网络编号 2
    0xFF,//PC编号 3
    0xFF,0x03,//请求目标模块 4-5
    0x00,//请求目标多点站号 6
    0x1C,0x00,//请求数据长 7-8
    0x10,0x00,//保留 9-10
    0x01,0x14,//指令 11-12
    0x00,0x00,//子指令 13-14
    0x00,0x00,0x00,//起始软元件编号 15-16-17
    0xA8,//软元件代码 18
    0x08,0x00,//软元件点数 19-20
];

const message_base_read = [
    0x50,0x00,//副帧头 0-1
    0x00,//网络编号 2
    0xFF,//PC编号 3
    0xFF,0x03,//请求目标模块 4-5
    0x00,//请求目标多点站号 6
    0x0C,0x00,//请求数据长 7-8
    0x10,0x00,//保留 9-10
    0x01,0x04,//指令 11-12
    0x00,0x00,//子指令 13-14
    0x00,0x00,0x00,//起始软元件编号 16-16-17
    0xA8,//软元件代码 18
    0x11,0x00,//软元件点数 19-20
];


const message_base_flag = [
    0x50,0x00,//副帧头 0-1
    0x00,//网络编号 2
    0xFF,//PC编号 3
    0xFF,0x03,//请求目标模块 4-5
    0x00,//请求目标多点站号 6
    0x0C,0x00,//请求数据长 7-8
    0x10,0x00,//保留 9-10
    0x01,0x04,//指令 11-12
    0x01,0x00,//子指令 13-14
    0x00,0x00,0x00,//起始软元件编号 16-16-17
    0x90,//软元件代码 18
    0x01,0x00,//软元件点数 19-20
];


const area=18;//区域
const address_1=15;//位置1
const address_2=16;//位置2
const address_3=17;//位置3
const read_bit_1=19;//数量1
const read_bit_2=20;//数量2
function getArea(Area) {
    if(Area.toUpperCase( ) == "M"){
        return 0x90;
    }
    if(Area.toUpperCase( ) == "D"){
        return 0xA8;
    }
    if(Area.toUpperCase( ) == "X"){
        return 0x9C;
    }
    return null;
}
function setAddress(address,read) {
    var tempaddress = address.toString(16);
    if(tempaddress.length%2!=0){
        tempaddress="0"+tempaddress;
    }
    var temp = dataformat.hex2bytes(tempaddress);
    for(var i=0;i<temp.length;i++){
        console.log("当前访问地址:"+temp[i].toString(16));
    }
    if(temp.length==1){
        read[address_1]=temp[0];
    }
    if(temp.length==2){
        read[address_1]=temp[1];
        read[address_2]=temp[0];
    }
    if(temp.length==3){
        read[address_1]=temp[2];
        read[address_2]=temp[1];
        read[address_3]=temp[0];
    }
}

function setBit(len,arr) {
    var hexLen = len.toString(16);
    if(hexLen.length%2!=0){
        hexLen="0"+hexLen;
    }
    var temp = dataformat.hex2bytes(hexLen);
    if(temp.length==1){
        arr[read_bit_1]=temp[0];
        arr[read_bit_2]=0x00;
    }
    if(temp.length==2){
        arr[read_bit_1]=temp[1];
        arr[read_bit_2]=temp[0];
    }
}



const plc = {
    write : function(Area,Address,data) {
        var set = message_base_write.slice(0);
        set[area] = getArea(Area);
        setAddress(Address, set);
        var volume_min = dataformat.float2bytes(data);
        var volume_min2 = dataformat.float2bytes2(data);
        console.log(volume_min);
        set[set.length]=volume_min[0];
        set[set.length]=volume_min[1];
        set[set.length]=volume_min[2];
        set[set.length]=volume_min[3];
        console.log(set);
        console.log(volume_min);
        console.log(volume_min2);
        client.write(new Buffer(set));
    },
    read : function(Area,Address,len) {
        var hex = new Array(len*2);
        var read = message_base_read.slice(0);
        read[area] = getArea(Area);
        setAddress(Address, read);
        setBit(len, read);
        for(var i=0;i<read.length;i++){
            console.log((read[i]&0xFF).toString(16));
        }
        client.write(new Buffer(read));
        return hex;
    },
    getFlag : function(Area,Address) {
        var read = message_base_flag.slice(0);  //克隆报文
        read[area] = getArea(Area);
        setAddress(Address, read);
        for(var i=0;i<read.length;i++){
            console.log((read[i]&0xFF).toString(16));
        }
        client.write(new Buffer(read));
    }
}
module.exports = plc;