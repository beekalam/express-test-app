var net = require('net');
var socket = new net.Socket(/* fd: null, type: null, allowHalfOpen: false */);

socket.connect(8181, '127.0.0.1' /*, connectListener replaces on('connect') */);

socket.on('connect', function() {
    console.log('connected to: ' + this.remoteAddress);
    var obj = { name: 'Frodo', occupation: 'adventurer' };
    this.write(JSON.stringify(obj));
});

socket.on('error', function(error) {
    console.log('' + error);
    // Don't persist this socket if there is a connection error
    socket.destroy();
});

socket.on('data', function(data) {
    console.log('from server: ' + data);
});
socket.setEncoding('utf-8'); /* utf8, utf16le, ucs2, ascii, hex */

socket.setTimeout(2e3 /* milliseconds */ , function() {
    console.log('timeout completed');
    var obj = { name: 'timeout', message: 'I came from a timeout'};
    this.write(JSON.stringify(obj));
});
