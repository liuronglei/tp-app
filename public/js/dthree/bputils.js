// 声明一个全局对象Namespace，用来注册命名空间
Namespace = new Object();

// 全局对象仅仅存在register函数，参数为名称空间全路径，如"Grandsoft.GEA"
Namespace.register = function(fullNS) {
    // 将命名空间切成N部分, 比如Grandsoft、GEA等
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++)
    {
        if (i != 0) sNS += ".";
         sNS += nsArray[i];
        // 依次创建构造命名空间对象（假如不存在的话）的语句
        // 比如先创建Grandsoft，然后创建Grandsoft.GEA，依次下去
         sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();"
     }
    if (sEval != "") eval(sEval);
}

// 注册命名空间
Namespace.register("BeePower.Mqtt");
Namespace.register("BeePower.Svg");

//================================= Mqtt =================================

// BeePower.Mqtt命名空间里面声明类Client
BeePower.Mqtt.Client = function(host, port, clientId) {
    this.host = host;
    this.port = port;
    this.clientId = clientId;
    this.client = new Paho.MQTT.Client(this.host, Number(this.port), this.clientId);
}

BeePower.Mqtt.Client.prototype.connect = function(onSuccess, onFailure, onConnectionLost, onMessageArrived) {
    var user = "test.mqtt.beepower.cn";
    var password = "";
    //client.onConnect = bp_onConnect;
    this.client.onMessageArrived = onMessageArrived;
    this.client.onConnectionLost = onConnectionLost;
    console.log("connection...");
    this.client.connect({
        timeout:30,//如果在改时间端内尚未连接成功，则认为连接失败  默认为30秒
    	userName:user,
    	password:password,
    	//willMessage:'willMessage',//当连接非正常断开时，发送此遗言消息
    	//keepAliveInterval:60, //心跳信号 默认为60秒
    	cleanSession:true, //若设为false，MQTT服务器将持久化客户端会话的主体订阅和ACK位置，默认为true
    	//useSSL:false,
    	//invocationContext:"success",//作为onSuccess回调函数的参数
    	onSuccess: onSuccess,
    	onFailure: onFailure
    });
    console.log("!!! connection finished !!!");
}

BeePower.Mqtt.Client.prototype.subscribe = function(topic) {
    this.client.subscribe(topic);
}

BeePower.Mqtt.Client.prototype.send = function(toSendObj, destinationName) {
    var oriBuf = toSendObj.encode().toBuffer();
    var buf = new ArrayBuffer(oriBuf.byteLength + 1);
    //先把测试标识位写进去
    var writer = new DataView(buf);
    writer.setInt8(0, 0);
    var reader = new DataView(oriBuf);
    for(var i = 0; i < oriBuf.byteLength; i++)
        writer.setUint8(i + 1, reader.getUint8(i));
    var message = new Paho.MQTT.Message(buf);
    message.destinationName = destinationName;
    this.client.send(message);
}

//================================= Svg =================================

//定义Viewer类
BeePower.Svg.Viewer = function() {
}

//定义Map类
BeePower.Map = function() {  
    this.elements = new Array();  
  
    this.size = function() {  
        return this.elements.length;  
    }  
  
    this.isEmpty = function() {  
        return (this.elements.length < 1);  
    }  
  
    this.clear = function() {  
        this.elements.length = 0;  
    }  
  
    this.put = function(_key, _value) {  
        this.elements.push( {  
            key : _key,  
            value : _value  
        });  
    } 
    
    this.remove = function(_key) {  
        try {  
            for ( var i = 0; i < this.size(); i++) {  
  
                if (this.elements[i].key == _key)  
                    this.elements.splice(i, 1);  
                return true;  
            }  
        } catch (e) {  
            return false;  
        }  
        return false;  
    }  
  
    this.get = function(_key) {  
          
        try {  
            for ( var i = 0; i < this.size(); i++) {  
                if (this.elements[i].key == _key) {  
                    var _value = this.elements[i].value;  
                    return _value;  
                }  
            }  
        } catch (e) {  
            return null;  
        }  
        return null;  
    }  
      
    this.containsKey=function(_key){  
        try {  
            for ( var i = 0; i < this.size(); i++) {  
                if (this.elements[i].key == _key) {  
                    return true;  
                }  
            }  
        } catch (e) {  
            return false;  
        }  
        return false;  
    }  
  
      
    this.getValues=function(){  
        var values=new Array();  
        try {  
            for ( var i = 0; i < this.size(); i++) {  
                values.push(this.elements[i].value);  
            }  
        } catch (e) {  
            alert("Can not get Map Values ! {1}"+e.message);  
            return null;  
        }  
        return values;  
    }  
      
    this.getKeys=function(){  
        var keys=new Array();  
        try {  
            for ( var i = 0; i < this.size(); i++) {  
                keys.push(this.elements[i].key);  
            }  
        } catch (e) {  
            alert("Can not get Map Keys ! {1}"+e.message);  
            return null;  
        }  
        return keys;  
    }  
    
    this.forEach = function(fn){
        if(typeof fn != 'function'){
            return;
        }
        for(var i=0;i<this.size();i++){
            var k = this.elements[i].key;
            fn(this.get(k),k,i);
        }
    };
      
    this.mapStr=function(){  
        return this.elements.toString();  
          
    }   
      
}

BeePower.Svg.Viewer.prototype.load = function(option) {
    var svgPath = option.path;
    var ele = option.id;
    var callback = option.callback;
    var refreshTime = option.refreshTime;
    var refreshOption = option.refreshOption;
	var zoom = d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", zoomed);
	
	function zoomed() {
//		   d3.select(this).attr("transform","translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");
//	   d3.select(this).select("g").attr("transform","translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");
	   d3.select(this).select("#layer1").attr("transform","translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");
	   d3.select(this).select("#pic").attr("transform","translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");

	}
    var descStart = "MeasureResult/";
    //
    this.contentMap = new BeePower.Map();
    this.refreshMap = new BeePower.Map();
    var This = this;
    if(refreshOption) {
        for(var key in refreshOption) {
            this.refreshMap.put(refreshOption[key].text, refreshOption[key].content);
        }
    }
    d3.xml(svgPath, function(error, documentFragment) {
        
        if (error) {console.log(error); return;}

        var svgNode = documentFragment.getElementsByTagName("svg")[0];
        //d3's selection.node() returns the DOM node, so we
        //can use plain Javascript to append content    
        //use plain Javascript to extract the node
        var main_chart_svg = d3.select('#' + ele);
        main_chart_svg.select("svg").remove();
       
        main_chart_svg.node().appendChild(svgNode);
        var innerSVG = main_chart_svg.select("svg");
//        d3.select("#CN").attr("display","none")
        innerSVG.attr("width", "100%").attr("height", "100%").attr("preserveAspectRatio", "xMidYMid meet");
        innerSVG.selectAll("g")
        .each(function (d, i) {
        	var id = this.id;
        	if (isNumber(id)){
        		d3.select(this).attr("id","a"+id);
        	}
        });

        /* 要修改回来
        d3.select("#Analog").selectAll("g").each(function (d, j) {
    	  if(this.attributes["devID"]){
    		  var devId = this.attributes["devID"].nodeValue;
    	    	var text =d3.select(this).select("text");
    	      	var content = $.trim(text.text());
                if(This.refreshMap.containsKey(content)) {
                    var textArr = This.contentMap.get(content);
                    if(textArr == null) {
                        textArr = new Array();
                        This.contentMap.put(content, textArr);
                    }
                    textArr[textArr.length] = text;
                    setAnalogInnerText(text, This.refreshMap.get(content));
                }
    	  }
      });
      */
        

        innerSVG.call(zoom);
//        innerSVG.call(drag);
        window.setInterval(function() {
            This.contentMap.forEach(function randomData(value, key, m) {
                for(var index in value) {
                    setAnalogInnerText(value[index], This.refreshMap.get(key));
                }
            });
    	}, refreshTime);
        if( typeof(callback)=="function"){
        	callback();
        }
//        d3.select("#CN").attr("display","none");
    });
    return this.contentMap;
}

  
BeePower.Svg.Viewer.prototype.subscribe = function(topicToDomNode) {
    console.log("subscribe start");
    //存在动态数据需要查询
    if(topicToDomNode.size() > 0) {
        var messageProto = dcodeIO.ProtoBuf.loadProtoFile(ctx + "/proto/message.proto").build("domain.message");
        var fesProto = dcodeIO.ProtoBuf.loadProtoFile(ctx +"/proto/fes.proto").build("eig.fes");
        var bytes = new Uint8Array(2);
        bytes[0] = 0;
        bytes[0] = 0;
        var defaultMeasure = fesProto.PowerValue.decode(bytes);
        var clientId = guid();
        var client = new BeePower.Mqtt.Client("mq.beepower.com.cn", "9001", clientId);
        var fieldNames = ["v", "p", "i"];
        var fieldDisplayNames = ["电压", "功率", "电流"];
        //实际响应消息的函数
        onMessageArrived = function(msg) {                
            var measure;
            fieldNames.forEach(onShowField);            
            function onShowField(fieldName, index, array) {
                var tmp = msg.destinationName.substring(0, msg.destinationName.lastIndexOf("/"));
                var terminalId = tmp.substring(tmp.lastIndexOf("/") + 1);
                var key = "MeasureResult/" + terminalId + "/" + fieldName;
                if(!topicToDomNode.containsKey(key))
                    return;
                if(measure == undefined) {
                    var payload = messageProto.Payload.decode(msg.payloadBytes);
                    measure = fesProto.PowerValue.decode(payload.value);
                }
                var textNode = topicToDomNode.get(key);
                var receivedV = measure.get(fieldName);
                var defaultV = defaultMeasure.get(fieldName);
                if(receivedV == defaultV)
                    return;
                d3.select("#" + textNode.id).text(fieldDisplayNames[index] + ":" + receivedV.toFixed(1));
            }
        }

        onConnectionLost = function(failure) {
            console.log("connection lost!");
            setTimeout("client.connect(onSuccess, onFailure, onConnectionLost, onMessageArrived)", 30000);
        }

        onFailure = function(failure) {
            console.log("connection failed!");
        }

        onSuccess = function(success) {
            console.log("connection success!");
            topicToDomNode.forEach(function subscribeElements(value, key, m) {
                var tmp = key.substring(0, key.lastIndexOf("/"));
                var topic = "fes/M_/" + tmp.substring(tmp.lastIndexOf("/") + 1) + "/+";
                console.log("subscribe topic : " + topic);
                client.subscribe(topic);
            });               
        }

        client.connect(onSuccess, onFailure, onConnectionLost, onMessageArrived);
    }            
}

BeePower.Svg.Viewer.prototype.refreshData = function(refreshOption) {
    if(refreshOption) {
        for(var key in refreshOption) {
            this.refreshMap.put(refreshOption[key].text, refreshOption[key].content);
        }
    }
    var This = this;
    this.contentMap.forEach(function randomData(value, key, m) {
        for(var index in value) {
            setAnalogInnerText(value[index], This.refreshMap.get(key));
        }
    });
}

function setAnalogInnerText(obj, fn) {
    if(typeof fn != 'function'){
        return;
    }
    var data = fn(obj);
    if(data instanceof Array) {
        obj.text('');
        obj.selectAll("tspan")
            .data(data)
            .enter()
            .append("tspan")
            .attr("x",obj.attr("x"))
            .attr("dy","1em")
            .text(function(d){
                return d;
            });
    } else {
        obj.text(data);
    }
}

function guid() {  
    return '4xxx-yxxx'.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);  
        return v.toString(16);  
    });  
}

function isNumber(String){
    if(String == null || String == '') return false;
    var Letters = "1234567890";//可以自己增加可输入值
    var i;
    var c;
    for(i = 0;i < String.length; i++){
        c = String.charAt(i);
        if(Letters.indexOf(c) < 0)
            return false;
    }
    return true;
}