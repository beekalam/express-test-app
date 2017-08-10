var net = require('net');

//createConnection
var connection = net.createConnection({port:8181, host:'127.0.0.1'},
//connectionListener callback
function(){
    console.log('connection successful');
    this.write('hello');
});

connection.on('data', function(data){
    console.log(data.toString());
});

connection.on('error', function(error){
    console.log(error);
});

connection.on('end', function(){
    console.log('connection ended');
});
