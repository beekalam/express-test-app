var pcap = require('pcap');
const fs = require('fs');
var redis = require('redis');
var client = redis.createClient();
process.on('message', (m) => {
    // console.log('decoding packet:');
    console.log(m["saddr"].join('.') + ":" + m["sport"] + "==" + m["daddr"].join('.') + ":" + m["dport"]);
    client.set(m["saddr"].join('.'), m["saddr"].join('.') + ":" + m["sport"] + "==" + m["daddr"].join('.') + ":" + m["dport"]);
    // console.log(m["daddr"].join('.'));
    // console.log(m.raw_packet);
    // if (m === 'custompacket') {
        // console.log("in child process -pid: " + process.pid);
        // console.log("length: " + packet.payload.payload.payload.dataLength);
    // var packet = pcap.decode.packet(m);

    // console.log(pcap.decode.packet(m));
    // var stream = fs.createWriteStream('/tmp/test.log');
    // stream.once('open', function(fd){
        // stream.write('new packet');
        // stream.end();
    // });
    // console.log(packet);
    // console.log(m);
    // }
}); 

