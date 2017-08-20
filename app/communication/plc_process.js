/**
 * Created by liurong on 2017/8/10.
 */
var fs = require('fs');
var net = require('net');
var path = require('path');
var __rootdir = global.sharedObject.rootdir;
var dataformat = require(path.join(__rootdir,'app/utils/dataformat'));
var property = JSON.parse(fs.readFileSync(path.join(__rootdir,'app/config/config_plc.json'), 'utf8'));
const m_barcode = require(path.join(__rootdir, 'app/models/m_barcode'))
const plc = {
    setCssz : function(csszHashMap) {
        var rlfw = csszHashMap.get('rlfw');
        var rlfwArr = rlfw.split(";");
        var dycfw = csszHashMap.get('dycfw');
        var dycfwArr = dycfw.split(";");
        var dyfw = csszHashMap.get('dyfw');
        var dyfwArr = dyfw.split(";");
        var nzfw = csszHashMap.get('nzfw');
        var nzfwArr = nzfw.split(";");
        var sjsx = csszHashMap.get('sjsx');
        var zxs = csszHashMap.get('zxs');
        plc_process.write("D", 1734, [parseFloat(rlfwArr[0])]); //容量下限
        plc_process.write("D", 1736, [parseFloat(rlfwArr[1])]); //容量上限
        plc_process.write("D", 1730, [parseFloat(dycfwArr[0])]); //压差下限
        plc_process.write("D", 1732, [parseFloat(dycfwArr[1])]); //压差上限
        plc_process.write("D", 1600, [parseFloat(dyfwArr[0])]); //电压下限
        plc_process.write("D", 1602, [parseFloat(dyfwArr[1])]); //电压上限
        plc_process.write("D", 1604, [parseFloat(nzfwArr[0])]); //内阻下限
        plc_process.write("D", 1606, [parseFloat(nzfwArr[1])]); //内阻上限
        plc_process.write("D", 2626, [parseFloat(zxs)]); //正常装箱数
        plc_process.write("M", 2530, [parseFloat(sjsx)]); //OCV勾选
    },
    writeBarInfo : function(rlArr,ocv4Arr) {
        var data = new Array();
        for(var i=0; i<rlArr.length; i++) {
            data[data.length] = parseFloat(rlArr[i]);
        }
        for(var i=0; i<ocv4Arr.length; i++) {
            data[data.length] = parseFloat(ocv4Arr[i]);
        }
        plc_process.write("D", 1800, data); //OCV检测数据
    },
    readCheckInfo : function(callBack) {
        plc_process.getFlag("M", 511, 1, function(data) {
            if(data == 1) {
                plc_process.read("D", 4000, 116, function(data) {
                    callBack(data);
                });
            }
        });
    },
    readBarCodeInfo : function(callBack) {
        plc_process.getFlag("D", 101, 1, function(data) {
            if(data == 1) {
                m_barcode.queryBarCode(callBack);
            }
        });
    }
}

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

/*
 byte[] readData = new byte[]{
 (byte)0x50,(byte)0x00,//副帧头
 (byte)0x00,//网络编号
 (byte)0xFF,//PC编号
 (byte)0xFF,(byte)0x03,//请求目标模块
 (byte)0x00,//请求目标多点站号
 (byte)0x0C,(byte)0x00,//请求数据长
 (byte)0x10,(byte)0x00,//保留
 (byte)0x01,(byte)0x04,//指令
 (byte)0x00,(byte)0x00,//子指令
 (byte)0xA0,(byte)0x0F,(byte)0x00,//起始软元件编号   D4000-D4067
 (byte)0xA8,//软元件代码
 (byte)0x44,(byte)0x00,//软元件点数 ,  68个字
 };
 */


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
        console.log("current address:"+temp[i].toString(16));
    }
    console.log(temp);
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

const plc_process = {
    write : function(Area,Address,len,data) {
        var set = message_base_write.slice(0);
        set[area] = getArea(Area);
        setAddress(Address, set);
        setBit(len, set);
        for(var i=0; i<data.length; i++) {
            var data_byte = dataformat.float2bytes(data[i]);
            //var data_byte2 = dataformat.float2bytes2(data[i]);
            console.log(data_byte);
            set[set.length]=data_byte[0];
            set[set.length]=data_byte[1];
            set[set.length]=data_byte[2];
            set[set.length]=data_byte[3];
        }
        console.log(new Buffer(set));
        _client.write(set);
    },
    read : function(Area,Address,len,callBack) {
        var read = message_base_read.slice(0);
        read[area] = getArea(Area);
        setAddress(Address, read);
        setBit(len, read);
        /*
         for(var i=0;i<read.length;i++){
         console.log((read[i]&0xFF).toString(16));
         }
         */
        console.log(new Buffer(read));
        _client.write(read);
        _client.receiveInfo(len,callBack);
    },
    getFlag : function(Area,Address,len,callBack) {
        var read = message_base_flag.slice(0);  //克隆报文
        read[area] = getArea(Area);
        setAddress(Address, read);
        /*
         for(var i=0;i<read.length;i++){
         console.log((read[i]&0xFF).toString(16));
         }
         */
        console.log('getBarCodeFlag:');
        console.log(new Buffer(read));
        _client.write(read);
        _client.receiveFlag(1,callBack);
    }
}




var client= new net.Socket();
client.setEncoding('binary');
//连接到服务端
client.connect(parseInt(property.PLC_PORT),property.PLC_IP,function(){
    console.log('connected');
});
client.on('error',function(error){
    console.log('error:'+error);
    //client.destory();
});
client.on('close',function(){
    console.log('Connection closed');
});
const _client = {
    receiveFlag : function(len,callBack) {
        client.on('data',function(data){
            console.log(new Buffer(data).toString('hex'));
            var response = dataformat.hex2bytes();
            //var response = new Array(11+len);
            /*
            for(var i=0;i<response.length;i++){
                console.log((response[i]&0xFF).toString(16));
            }
            */
            hex = (response[11]&0xFF).toString(16);
            if(hex.length<2){
                hex="0"+hex;
            }
            var returnValue = false;
            if(hex == "10" || hex == "11") {
                returnValue = true;
            } else if(hex == "00" || hex == "01") {
                returnValue = false;
            } else {
                console.log("readFlag Error！！！！");
                returnValue = false;
            }
            console.log('recv data:'+ returnValue);
            callBack(returnValue);
        });
    },
    receiveInfo : function(len,callBack) {
        client.on('data',function(data){
            console.log('recv data old:');
            console.log(data);
            var hex = new Array(len*2);
            var response = new Array(11+len*2);
            response = data;
            var response_frame = new Array(len*2);
            for(var i=0;i<response.length;i++){
                console.log((response[i]&0xFF).toString(16));
            }
            for(var i=11;i<response.length;i++){
                response_frame[i-11]=response[i];
                hex[i-11]=(response_frame[i-11]&0xFF).toString(16);
                if(hex[i-11].length<2){
                    hex[i-11]="0"+hex[i-11];
                }
            }
            console.log('recv data new:'+ hex);
            callBack(hex);
        });
    },
    write : function(data) {
        client.write(new Buffer(data));
    }
}

module.exports = plc;