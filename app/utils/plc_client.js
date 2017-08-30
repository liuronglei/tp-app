/**
 * PLC客户端方法工具类
 */
var fs = require('fs');
var net = require('net');
var path = require('path');
var __rootdir = global.sharedObject.rootdir;
var dataformat = require(path.join(__rootdir,'app/utils/dataformat'));
var property = JSON.parse(fs.readFileSync(path.join(__rootdir,'app/config/config_plc.json'), 'utf8'));
const message_base_write = [
    0x50,0x00,//副帧头 0-1
    0x00,//网络编号 2
    0xFF,//PC编号 3
    0xFF,0x03,//请求目标模块 4-5L
    0x00,//请求目标多点站号 6
    0x10,0x00,//请求数据长 7-8 //0x10
    0x10,0x00,//保留 9-10
    0x01,0x14,//指令 11-12
    0x00,0x00,//子指令 13-14
    0x00,0x00,0x00,//起始软元件编号 15-16-17
    0xA8,//软元件代码 18
    0x02,0x00,//软元件点数 19-20
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
    0x00,0x00,0x00,//起始软元件编号 16-16-17 //0x66,0x00,0x00 起始地址16进制
    0xA8,//软元件代码 18
    0x11,0x00,//软元件点数 19-20 //0x02 字
];
const message_base_write_flag = [
    0x50,0x00,//副帧头 0-1
    0x00,//网络编号 2
    0xFF,//PC编号 3
    0xFF,0x03,//请求目标模块 4-5
    0x00,//请求目标多点站号 6
    0x0D,0x00,//请求数据长 7-8
    0x10,0x00,//保留 9-10
    0x01,0x14,//指令 11-12
    0x01,0x00,//子指令 13-14
    0x00,0x00,0x00,//起始软元件编号 15-16-17
    0x90,//软元件代码 18
    0x02,0x00,//软元件点数 19-20
    0x00//写入数据 21
];
const message_base_read_flag = [
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
    0x90,//软元件代码 18
    0x01,0x00,//软元件点数 19-20
];
const len_1=7;//数据长度位置
const len_2=8;//数据长度位置
const area=18;//区域
const address_1=15;//位置1
const address_2=16;//位置2
const address_3=17;//位置3
const read_bit_1=19;//数量1
const read_bit_2=20;//数量2
var callBack_receive;
/***********************报文组装相关方法************************/
function getReadSet(Area,Address,len) {
    var set = message_base_read.slice(0);
    set[area] = getArea(Area);
    setAddress(Address, set);
    setBit(len, set);
    return set;
}
function  getWriteSet(Area,Address,len) {
    var set = message_base_write.slice(0);
    set[area] = getArea(Area);
    setAddress(Address, set);
    setLength(12 + len*2,set);
    setBit(len, set);
    return set;
}
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
function setLength(len,write) {
    var templen = len.toString(16);
    if(templen.length%2!=0){
        templen="0"+templen;
    }
    var temp = dataformat.hex2bytes(templen);
    if(temp.length==1){
        write[len_1]=temp[0];
    }
    if(temp.length==2){
        write[len_1]=temp[1];
        write[len_2]=temp[0];
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
function getFlagByte(value) {
    var flagByte = new Array();
    var dataByteArr = dataformat.hex2bytes(dataformat.int2hex(value));
    flagByte[flagByte.length]=dataByteArr[0];
    flagByte[flagByte.length]=dataByteArr.length>1 ? dataByteArr[1] : 0x00;
    flagByte[flagByte.length]=dataByteArr.length>2 ? dataByteArr[2] : 0x00;
    flagByte[flagByte.length]=dataByteArr.length>3 ? dataByteArr[3] : 0x00;
    return flagByte;
}
const plc_client = {
    //PLC数据接收
    dataReceive : function() {
        _client.strartListen(function(hexStr) {
            if(hexStr == null || hexStr.length < 22 || hexStr.substring(16,22) != "000000") {
                //正常返回报文第9、10、11个字都必须为0，不然就是异常
                if(callBack_receive != null) {
                    callBack_receive(true, hexStr);
                    callBack_receive = null;
                }
                return;
            } else if(callBack_receive != null) {
                callBack_receive(false,hexStr);
                callBack_receive = null;
            }
        });
    },
    getFlagByte : function(value) {
        return getFlagByte(value);
    },
    //PLC数据写入（字节数组）
    writeByte : function(Area,Address,len,data,callBack) {
        var set = getWriteSet(Area,Address,len);
        for(var i=0; i<data.length; i++) {
            set[set.length]=data[i];
        }
        _client.write(set,callBack);
    },
    //PLC数据写入（二进制数）
    writeBinary : function(Area,Address,len,data,callBack) {
        var set = getWriteSet(Area,Address,len);
        data = parseInt(data,2);
        var flagByte = new Array();
        var dataByteArr = dataformat.hex2bytes(dataformat.int2hex(data));
        flagByte[flagByte.length]=dataByteArr.length>1 ? dataByteArr[1] : 0x00;
        flagByte[flagByte.length]=dataByteArr[0];
        flagByte[flagByte.length]=dataByteArr.length>3 ? dataByteArr[3] : 0x00;
        flagByte[flagByte.length]=dataByteArr.length>2 ? dataByteArr[2] : 0x00;
        for(var i=0; i<flagByte.length; i++) {
            set[set.length] = flagByte[i];
        }
        _client.write(set,callBack);
    },
    //PLC数据写入（浮点数）
    writeFloat : function(Area,Address,len,data,callBack) {
        var set = getWriteSet(Area,Address,len);
        for(var i=0; i<data.length; i++) {
            var data_byte = dataformat.float2bytes(data[i]);
            set[set.length]=data_byte[0];
            set[set.length]=data_byte[1];
            set[set.length]=data_byte[2];
            set[set.length]=data_byte[3];
        }
        _client.write(set,callBack);
    },
    //PLC数据写入（整数）
    writeInt : function(Area,Address,len,data,callBack) {
        var set = getWriteSet(Area,Address,len);
        var dataByteArr = getFlagByte(data);
        for(var i=0; i<dataByteArr.length; i++) {
            set[set.length] = dataByteArr[i];
        }
        _client.write(set,callBack);
    },
    //PLC数据读取（发送读取数据的报文，具体数据获取在dataReceive方法中定义）
    read : function(Area,Address,len,callBack) {
        var read = getReadSet(Area,Address,len);
        _client.write(read,callBack);
    },
    /* M区域数据目前没有使用，先注释掉
     getFlag : function(Area,Address,len,callBack) {
     var read = message_base_read_flag.slice(0);  //克隆报文
     read[area] = getArea(Area);
     setAddress(Address, read);
     console.log('getBarCodeFlag:');
     console.log(new Buffer(read));
     _client.write(read);
     _client.receiveFlag(len,callBack);
     },
     setFlag : function(Area,Address,data) {
     var set=message_base_write_flag.slice(0);
     set[area]=getArea(Area);
     setAddress(Address, set);
     if(data==0){
     set[write_bit]=0x00;
     }else if(data==1){
     set[write_bit]=0x11;
     }
     _client.write(set);
     }
     */
}
/***********************客户端相关方法************************/
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
var clientSyn = false;
const _client = {
    //开启监听
    strartListen : function(callBack) {
        client.on('data',function(data){
            //console.log("receiveData_old:" + new Buffer(data).toString('hex'));
            var receiveData = dataformat.report2hex(new Buffer(data).toString('hex'));
            //console.log("receiveData_new:" + receiveData);
            callBack(receiveData);
            clientSyn = false;
        });
    },
    //写入数据
    write : function(data,callBack,count) {
        //为避免PLC还未返回数据，已经有下次请求过来，故使用clientSyn标志
        //如果标记位为true，说明正在获取数据，等待10ms再执行，30次后若还是在等待，则强行执行
        if(clientSyn) {
            if(typeof count == "undefined") {
                count = 0;
            }
            if(count >= 30) {
                console.log("sendData: Timeout!!!!!!!" );
                callBack_receive = callBack;
                client.write(new Buffer(data));
            } else {
                setTimeout(function(){_client.write(data,callBack,++count);},10);
            }
        } else {
            clientSyn = true;
            callBack_receive = callBack;
            //console.log("sendData:" + new Buffer(read).toString('hex'));
            client.write(new Buffer(data));
        }
    }
}
module.exports = plc_client;