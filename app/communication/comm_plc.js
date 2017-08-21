/**
 * Created by liurong on 2017/8/10.
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
    0xFF,0x03,//请求目标模块 4-5
    0x00,//请求目标多点站号 6
    0x10,0x00,//请求数据长 7-8 //0x10
    0x10,0x00,//保留 9-10
    0x01,0x14,//指令 11-12
    0x00,0x00,//子指令 13-14
    0x00,0x00,0x00,//起始软元件编号 15-16-17
    0xA8,//软元件代码 18
    0x02,0x00,//软元件点数 19-20
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
const len_1=7;//数据长度位置
const len_2=8;//数据长度位置
const area=18;//区域
const address_1=15;//位置1
const address_2=16;//位置2
const address_3=17;//位置3
const read_bit_1=19;//数量1
const read_bit_2=20;//数量2
const write_bit=21;

const plc = {
    start: function() {
        plc_process.dataReceive();
    },
    readAllFlag : function(callBack) {
        callBack_allFlag = callBack;
        plc_process.read("D", property.ADDRESS_FLAG, 6);
    },
    finishBarCodeFlag : function() {
        plc_process.writeByte("D", property.ADDRESS_FLAG, 2, [0x02,0x00,0x00,0x00]);
    },
    resetCheckFlag : function() {
        plc_process.writeFloat("D", property.ADDRESS_FLAG + 2, 2, [0]);
    },
    resetBoxFlag : function() {
        plc_process.writeFloat("D", property.ADDRESS_FLAG + 4, 2, [0]);
    },
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
        plc_process.writeFloat("D", property.ADDRESS_RLXX, 2, [parseFloat(rlfwArr[0])]); //容量下限
        plc_process.writeFloat("D", property.ADDRESS_RLSX, 2, [parseFloat(rlfwArr[1])]); //容量上限
        plc_process.writeFloat("D", property.ADDRESS_DYCXX, 2, [parseFloat(dycfwArr[0])]); //压差下限
        plc_process.writeFloat("D", property.ADDRESS_DYCSX, 2, [parseFloat(dycfwArr[1])]); //压差上限
        plc_process.writeFloat("D", property.ADDRESS_DYXX, 2, [parseFloat(dyfwArr[0])]); //电压下限
        plc_process.writeFloat("D", property.ADDRESS_DYSX, 2, [parseFloat(dyfwArr[1])]); //电压上限
        plc_process.writeFloat("D", property.ADDRESS_NZXX, 2, [parseFloat(nzfwArr[0])]); //内阻下限
        plc_process.writeFloat("D", property.ADDRESS_NZSX, 2, [parseFloat(nzfwArr[1])]); //内阻上限
        plc_process.writeInt("D", property.ADDRESS_ZCZXS, 2, parseInt(zxs)); //正常装箱数
        plc_process.writeByte("D", property.ADDRESS_SJSX, 2, sjsx == "1" ? [0x01,0x00,0x00,0x00] : [0x00,0x00,0x00,0x00]); //OCV勾选
    },
    writeBarInfo : function(rlArr,ocv4Arr) {
        var data = new Array();
        for(var i=0; i<rlArr.length; i++) {
            data[data.length] = rlArr[i];
        }
        for(var i=0; i<ocv4Arr.length; i++) {
            data[data.length] = ocv4Arr[i];
        }
        plc_process.writeFloat("D", property.ADDRESS_OCVDATA, 48, data); //OCV检测数据
    },
    readCheckInfo : function(callBack) {
        callBack_checkFlag = callBack;
        plc_process.read("D", property.ADDRESS_CHECKDATA, 116);
    },


}

var callBack_allFlag;
var callBack_checkFlag;
/***********************报文组装相关方法************************/
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

const plc_process = {
    dataReceive : function() {
        _client.strartListen(function(hexStr) {
            var index_fix = 28; //报文返回内容起始下标值
            var len = 8;        //双字16进制位数
            var single_len = 4; //单字16进制位数
            //获取标记位的返回
            if(hexStr.length == index_fix + len*3) {
                var flagArr = [false, false, false];
                var tempStr = hexStr.substring(index_fix, index_fix + len);
                if(property.FLAG_TRUE == tempStr) {
                    flagArr[0] = true;
                }
                tempStr = hexStr.substring(index_fix + len, index_fix + len*2);
                if(property.FLAG_TRUE == tempStr) {
                    flagArr[1] = true;
                }
                tempStr = hexStr.substring(index_fix + len*2, index_fix + len*3);
                if(property.FLAG_TRUE == tempStr) {
                    flagArr[2] = true;
                }
                callBack_allFlag(flagArr);
            //获取电性能检测结果的返回
            } else if(hexStr.length == index_fix + len*58) {
                var errorFlag = "0100";
                var nzArr = new Array(property.CHECK_NUM_SINGLE);
                var dyArr = new Array(property.CHECK_NUM_SINGLE);
                var zztArr = new Array(property.CHECK_NUM_SINGLE);
                var dyztArr = new Array(property.CHECK_NUM_SINGLE);
                var nzztArr = new Array(property.CHECK_NUM_SINGLE);
                var rlztArr = new Array(property.CHECK_NUM_SINGLE);
                var dycztArr = new Array(property.CHECK_NUM_SINGLE);
                for(var i=0; i<nzArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*i, index_fix + len*(i+1));
                    nzArr[i] = dataformat.hex2float(tempStr);
                }
                for(var i=0; i<dyArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE+i), index_fix + len*(property.CHECK_NUM_SINGLE+i+1));
                    dyArr[i] = dataformat.hex2float(tempStr);
                }
                for(var i=0; i<dyArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE+i), index_fix + len*(property.CHECK_NUM_SINGLE+i+1));
                    dyArr[i] = dataformat.hex2float(tempStr);
                }
                for(var i=0; i<zztArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*i,
                                                index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(i+1));
                    zztArr[i] = tempStr == errorFlag ? false : true;
                }
                for(var i=0; i<dyztArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE+i),
                                                index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE+i+1));
                    dyztArr[i] = tempStr == errorFlag ? false : true;
                }
                for(var i=0; i<nzztArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*2+i),
                                                index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*2+i+1));
                    nzztArr[i] = tempStr == errorFlag ? false : true;
                }
                for(var i=0; i<rlztArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*3+i),
                                                index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*3+i+1));
                    rlztArr[i] = tempStr == errorFlag ? false : true;
                }
                for(var i=0; i<dycztArr.length; i++) {
                    tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*4+i),
                                                index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*4+i+1));
                    dycztArr[i] = tempStr == errorFlag ? false : true;
                }
                callBack_checkFlag(nzArr,dyArr,zztArr,dyztArr,nzztArr,rlztArr,dycztArr);
            }
        });
    },
    writeByte : function(Area,Address,len,data) {
        var set = message_base_write.slice(0);
        set[area] = getArea(Area);
        setAddress(Address, set);
        setLength(12 + len*2,set);
        setBit(len, set);
        for(var i=0; i<data.length; i++) {
            set[set.length]=data[i];
        }
        console.log(new Buffer(set));
        _client.write(set);
    },
    writeFloat : function(Area,Address,len,data) {
        var set = message_base_write.slice(0);
        set[area] = getArea(Area);
        setAddress(Address, set);
        setLength(12 + len*2,set);
        setBit(len, set);
        for(var i=0; i<data.length; i++) {
            var data_byte = dataformat.float2bytes(data[i]);
            set[set.length]=data_byte[0];
            set[set.length]=data_byte[1];
            set[set.length]=data_byte[2];
            set[set.length]=data_byte[3];
        }
        console.log(new Buffer(set));
        _client.write(set);
    },
    writeInt : function(Area,Address,len,data) {
        var set = message_base_write.slice(0);
        set[area] = getArea(Area);
        setAddress(Address, set);
        setLength(12 + len*2,set);
        setBit(len, set);
        var dataByteArr = dataformat.hex2bytes(dataformat.int2hex(data));
        console.log(dataByteArr);
        console.log(data);
        set[set.length]=dataByteArr[0];
        set[set.length]=dataByteArr.length>1 ? dataByteArr[1] : 0x00;
        set[set.length]=dataByteArr.length>2 ? dataByteArr[2] : 0x00;
        set[set.length]=dataByteArr.length>3 ? dataByteArr[3] : 0x00;
        console.log(new Buffer(set));
        _client.write(set);
    },
    read : function(Area,Address,len) {
        var read = message_base_read.slice(0);
        read[area] = getArea(Area);
        setAddress(Address, read);
        setBit(len, read);
        console.log("sendData:" + new Buffer(read).toString('hex'));
        _client.write(read);
    },
    getFlag : function(Area,Address,len,callBack) {
        var read = message_base_read_flag.slice(0);  //克隆报文
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
    strartListen : function(callBack) {
        client.on('data',function(data){
            clientSyn = false;
            var receiveData = new Buffer(data).toString('hex');
            console.log("receiveData:" + receiveData);
            callBack(receiveData);
        });
    },
    receiveFlag : function(len,callBack) {
        client.on('data',function(data){
            /*
            console.log("receiveFlag:");
            console.log(new Buffer(data));
            console.log(new Buffer(data).toString('hex'));
            var response = dataformat.hex2bytes(data);
            console.log(response);
            //var response = new Array(11+len);
             //for(var i=0;i<response.length;i++){
             //console.log((response[i]&0xFF).toString(16));
             //}
            var hex = (response[11]&0xFF).toString(16);
            if(hex.length<2){
                hex="0"+hex;
            }
            */
            var receiveData = new Buffer(data).toString('hex');
            console.log("receive flag init:" + receiveData);
            var hex = receiveData.substring(receiveData.length-2, receiveData.length);
            var flag = false;
            if(hex == "10" || hex == "11") {
                flag = true;
            } else if(hex == "00" || hex == "01") {
                flag = false;
            } else {
                console.log("readFlag Error！！！！");
                flag = false;
            }
            console.log("receive flag reset:" + hex);
            callBack(flag);
        });
    },
    receiveInfo : function(len,callBack) {
        client.on('data',function(data){
            /*
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
            */
            var receiveData = new Buffer(data).toString('hex');
            console.log('recv data init:'+ receiveData);
            var hex = receiveData.substring(receiveData.length-len*4, receiveData.length);
            var byteArr = dataformat.hex2bytes(hex);
            var retrunArr = new Array(len);
            for(var i=0; i<len; i++) {
                retrunArr[i] = dataformat.bytes2float(byteArr.slice(i*4,(i+1)*4));
            }
            console.log('recv data reset:'+ retrunArr);
            callBack(retrunArr);
        });
    },
    write : function(data,count) {
        if(clientSyn) {
            if(typeof count == "undefined") {
                count = 0;
            }
            if(count >= 20) {
                client.write(new Buffer(data));
            } else {
                setTimeout(function(){_client.write(data,++count);},50);
            }
        } else {
            clientSyn = true;
            client.write(new Buffer(data));
        }
    }
}
module.exports = plc;