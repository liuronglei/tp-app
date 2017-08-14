/**
 * Created by liurong on 2017/8/10.
 */


const aaa = ['aaa','bbb']

var fs = require('fs');
var net = require('net');
var path = require('path');
var property = JSON.parse(fs.readFileSync('config/config_plc.json', 'utf8'));
var client= new net.Socket();
client.setEncoding('binary');
//连接到服务端
client.connect(parseInt(property.PLC_PORT),property.PLC_IP,function(){
    console.log('connected');
    console.log(Buffer.concat(aaa));

    client.write(new Buffer(aaa));
});
client.on('data',function(data){
    console.log('recv data:'+ data);
});
client.on('error',function(error){
    console.log('error:'+error);
    //client.destory();
});
client.on('close',function(){
    console.log('Connection closed');
});







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
var area=18;//区域
function getFlag(Area,Address,len) {
    var hex;

    var read = read_flag.slice(0);
    read[area] = getArea(Area);
    this.setAddress(Address, read);
    for(int i=0;i<read.length;i++){
        System.out.print(Integer.toHexString(read[i]&0xFF)+" ");
    }
    System.out.println();
    _client.send(read);

    byte[] response=new byte[11+len];
    _client.receive(response);
    System.out.println(response.length);

    for(int i=0;i<response.length;i++){
        System.out.print(Integer.toHexString(response[i]&0xFF)+" ");
    }
    System.out.println();
    hex=String.valueOf(Integer.toHexString(response[11]&0xFF));
    if(hex.length()<2){
        hex="0"+hex;
    }
    System.out.println(hex);
    if(hex.equals("10")||hex.equals("11")){
        return true;
    }else if(hex.equals("00")||hex.equals("01")){
        return false;
    }else{
        System.out.println("读取标志位发生错误！！！！");
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

}


public synchronized void setAddress(int address,byte[] set) {
    String tempaddress=Integer.toHexString(address);
    if(tempaddress.length()%2!=0){
        tempaddress="0"+tempaddress;
    }
    byte[] temp=CodeUtil.HexString2Bytes(tempaddress);
    for(int i=0;i<temp.length;i++){
        System.out.println("当前访问地址"+Integer.toHexString(temp[i]));
    }
    if(temp.length==1){
        set[address_1]=temp[0];
    }
    if(temp.length==2){
        set[address_1]=temp[1];
        set[address_2]=temp[0];
    }
    if(temp.length==3){
        set[address_1]=temp[2];
        set[address_2]=temp[1];
        set[address_3]=temp[0];
    }
}





public synchronized boolean getFlag(String Area,int Address,int len) throws Exception{

    synchronized(_client){
        String hex;

        byte[] read=read_flag.clone();
        read[area]=this.getArea(Area);
        this.setAddress(Address, read);
        for(int i=0;i<read.length;i++){
            System.out.print(Integer.toHexString(read[i]&0xFF)+" ");
        }
        System.out.println();
        _client.send(read);

        byte[] response=new byte[11+len];
        _client.receive(response);
        System.out.println(response.length);

        for(int i=0;i<response.length;i++){
            System.out.print(Integer.toHexString(response[i]&0xFF)+" ");
        }
        System.out.println();
        hex=String.valueOf(Integer.toHexString(response[11]&0xFF));
        if(hex.length()<2){
            hex="0"+hex;
        }
        System.out.println(hex);
        if(hex.equals("10")||hex.equals("11")){
            return true;
        }else if(hex.equals("00")||hex.equals("01")){
            return false;
        }else{
            System.out.println("读取标志位发生错误！！！！");
            return false;
        }
    }
}