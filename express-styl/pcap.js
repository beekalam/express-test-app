var child = require('child_process').fork("child.js");
var child1 = require('child_process').fork("child.js");
var child2 = require('child_process').fork("child.js");
// var child3 = require('child_process').fork("child.js");
var cluster = require("cluster");
const StringDecoder = require("string_decoder").StringDecoder;
var numCPUS = require("os").cpus().length;

var pcap = require('pcap'),
    tcp_tracker = new pcap.TCPTracker(),
    pcap_session = pcap.createSession('lo','',1000 * 1024 * 1024);

var flattenObject = function(ob) {
    var toReturn = {};
    
    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;
        
        if ((typeof ob[i]) == 'object') {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

// tcp_tracker.on('session', function (session) {
//     // console.log("Start of session between " + session.src_name + " and " + session.dst_name);
//     session.on('end', function (session) {
//         // console.log("End of TCP session between " + session.src_name + " and " + session.dst_name);
//         if(session.src_name == '10.10.34.34:443' || session.dst_name == '10.10.34.34:443'){
//             console.log("from 10.10.34.34");
//         }
//     });
// });

// var count = 0;
// var sixin = 0;
// var app=[];
// if(cluster.isMaster){
//     for(var i = 0; i < numCPUS; ++i){
//         console.log("forking child");
//         console.log(cluster.fork());
//     }
// }
// else{
//     app.push(process.pid)

//     var net = require('net');

//     var server = net.createServer(function(connectionListener){
//         console.log('connected');

//         //get the configured address for the server
//         console.log(this.address());

//         //get connections takes callback function
//         this.getConnections(function(err, count){
//             if(err){
//                 console.log("Error getting connections");
//             }else{
//                 console.log("connections count: " + count);
//             }
//         });

//         connectionListener.on('end', function(){
//             console.log("disconnected");
//         });
//         //write to the connected socket
//         connectionListener.write('heyy\r\n');

//     });

//     server.on('error', function(err){
//         console.log('Server error: ' + err);
//     });

//     server.on('data', function(data){
//         console.log(data.toString());
//     });
//     server.listen(3389, function(){
//         console.log('server is listening');
//     });

// }

function number_format(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var count  = 0;
var sixin = 0;
var mg = 0;
var local = 0;
var next = 0;
var app = [];
app.push(child);
app.push(child1);
app.push(child2);
var udp=0;
var tcp=0;
pcap_session.on('packet', function (raw_packet) {
            // console.log(typeof raw_packet);
    // console.log(Object.keys( raw_packet));
    // child.send({p:raw_packet});//packet.payload.payload.payload.length});
    // console.log("finished sending..");
    // const decoder = new StringDecoder('utf8');
    // console.log(decoder.write(raw_packet['buf']));
    // child.send({header:raw_packet['header'],
                // link_type:raw_packet['link_type'],
                // buf:decoder.write(raw_packet['buf'])});
    // child.send({
        // buf: raw_packet['buf'],
                // header:raw_packet['header'],
                // link_type:raw_packet['link_type']});
    // console.log(raw_packet['buf'].length);
        // var data = packet.link.ip.tcp.data;
        // console.log(data.toString());
        count++;
        // if(count % 100 == 0){
        
            // console.log(packet.payload);
            // if(packet.payload.EthernetPacket){
            //     console.log(packet.payload.EthernetPacket);
            // }
            // if(packet.EthernetPacket){
            //     console.log(packet.payload.EthernetPacket);
            // }
            // // console.log(Object.keys(packet.payload.payload.protocolName));
            // // console.log(Object.keys(packet.payload.payload));
            // // console.log(Object.keys(packet.payload.payload.payload));
            // // console.log(packet.payload.payload.payload.dataLength);
            //for(var i =0; i < 2 ;++i){
                
                 // var start  =new Date().getTime();
                // for(var i = 0; i  < 1000; i++)
                    console.log(raw_packet);
                    var packet = pcap.decode.packet(raw_packet);
                    // console.log(packet);
                    // console.log(packet.payload.payload.payload.dataLength);
                     // sixin += packet.payload.payload.payload.dataLength;
                 // console.log(sixin);
                    // console.log(packet.payload.shost);
                    // console.log(packet.payload.dhost);
                    //console.log(packet.payload.EthernetPacket.payload.IPv4);
                    // console.log(packet.payload);
                   
                    var protocol= packet.payload.payload.protocol;
                
                 // console.log((new Date().getTime()) - start);    
                // console.log("protocol:%s", protocol );

                if(protocol == 6)
                {
                   // console.log("TCP");
                     // console.log( tcp_data_length);
                    var tcp_data_length = packet.payload.payload.payload.dataLength;
                    sixin += tcp_data_length;
                    if(sixin > 1000000)
                    {
                        sixin -= 1000000;
                        mg++;
                    }
                    tcp++;
                }else if(protocol == 12)
                {
                    // console.log("UDP");
                    udp++;
                }
                if(protocol == 47)
                {
                    // console.log(packet.payload);
                    // console.log(packet.payload.payload);
                    console.log(packet.payload.payload.payload);
                }
                if(protocol == 6 || protocol == 12)
                {
                    var saddr   = packet.payload.payload.saddr.addr;
                    var daddr   = packet.payload.payload.daddr.addr;
                    var sport   = packet.payload.payload.payload.sport;
                    var dport   = packet.payload.payload.payload.dport;

                    if(sport!='6379' && dport!='6379')
                    {                   
                        app[count%3].send({"count":count, "appIndex": count % 3, "saddr":saddr,"daddr":daddr,"sport":sport,
                            "dport":dport});
                    }

                    // if( count % 1000 == 0)
                    if(true)
                    {
                        // console.log("src   %s:%s",saddr,sport);
                        // console.log("dst   %s:%s",daddr,dport);
                    }
                //     console.log();
                }

                // console.log(packet.payload.payload);
                //console.log(packet.link_type);
                // console.log(flattenObject(packet));
                
                // if(packet.payload.payload.saddr=='192.168.1.106'){
                    // sixin += packet.payload.payload.payload.dataLength;
                // }
                // if(packet.payload.payload.daddr=='192.168.1.106'){
                    // sixin += packet.payload.payload.payload.dataLength;
                // }

                // sixin += packet.payload.payload.payload.dataLength;
               
                // console.log(start);
                //var packet  = pcap.decode.packet(raw_packet);
               
                // var to_send = {};
                // to_send["raw_packet"] = raw_packet;
                // console.log(to_send);
                // console.log(raw_packet["header"]);
                // child.send(to_send);
                // console.log(raw_packet.buf);
                // console.log();
                //console.log(packet);
                

                if(count % 1000 == 0)
                {
                    // console.log("data: " + (sixin/1024/1024));
                    // console.log("data-legnth: ", number_format(mg));
                    console.log("packet_count:" ,number_format(count));
                    // var d = new Date();
                    // console.log(d.getMinutes() + ":" + d.getSeconds());
                    // console.log("packets: " + number_format(count));
                    // sixin = 0;
                    // console.log("tcp_packets:  " + tcp);
                    // console.log("udp_packet: " + udp);
                }
            //}
            //     console.log("from: "+ process.pid);
            //     // console.log(app);

            // // console.log((packet.payload.payload.saddr));
            // console.log("count: " + count);
        
        //tcp_tracker.track_packet(packet);
});
// child.on('message',(m) =>{
//     console.log("parent got: ");
//     console.log(m);
// });
