/**
 * Created by liurong on 2017/8/10.
 */

const client = require("app/communication/plc_client");

const write_frame = [
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
const len_1=7;//数据长度位置
const len_2=8;//数据长度位置
const area=18;//区域
const address_1=15;//位置1
const address_2=16;//位置2
const address_3=17;//位置3
const write_bit=21;


const write_address1 = 21;
const write_address2 = 22;
const write_address3 = 23;
const write_address4 = 24;
const write_address5 = 25;
const write_address6 = 26;
const write_address7 = 27;
const write_address8 = 28;
const write_address9 = 29;
const write_address10 = 30;
const write_address11 = 31;
const write_address12 = 32;
const write_address13 = 33;
const write_address14 = 34;
const write_address15 = 35;
const write_address16 = 36;




const write_test = [
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
    0x00,0x00,0x00,0x00,//电压下限 21-24
    0x00,0x00,0x00,0x00,//电压上限 25-28
    0x00,0x00,0x00,0x00,//内阻下限 29-32
    0x00,0x00,0x00,0x00,//内阻上限 33-36
];

const read_frame= [
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

const read_flag = [
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


const read_bit_1=19;//数量1
const read_bit_2=20;//数量2



function setPlcArea(Area,Address,date) {
    var set = write_frame.slice(0);
    set[area] = getArea(Area);
    setAddress(Address, set);
    if(date==0){
        set[write_bit]=0x00;
    }else if(date==1){
        set[write_bit]=0x11;
    }
    //test
    for(var i=0;i<set.length;i++){
        console.log((set[i]&0xFF).toString(16));
    }
    client.write(set);
    var response = new Array(11);
    client.receive(response);
}










function getFlag(Area,Address,len) {
    var hex;
    var read = read_flag.slice(0);  //克隆报文
    read[area] = getArea(Area);
    setAddress(Address, read);
    for(var i=0;i<read.length;i++){
        console.log((read[i]&0xFF).toString(16));
    }
    client.write(new Buffer(read));

    var response= new Array(11+len);
    client.receive(response);
    console.log(response.length);

    for(var i=0;i<response.length;i++){
        console.log((response[i]&0xFF).toString(16));
    }
    hex=(response[11]&0xFF).toString(16);
    if(hex.length()<2){
        hex="0"+hex;
    }
    console.log(hex);
    if(hex == "10" || hex == "11"){
        return true;
    }else if(hex == "00" || hex == "01"){
        return false;
    }else{
        console.log("读取标志位发生错误！！！！");
        return false;
    }
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
    if(tempaddress.length()%2!=0){
        tempaddress="0"+tempaddress;
    }
    var temp = dataformat.hex2bytes(tempaddress);
    for(var i=0;i<temp.length;i++){
        console.log("当前访问地址"+temp[i].toString(16));
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


