var net = require('net');

var server = net.createServer(function(connectionListener){
    console.log('connected');

    //get the configured address for the server
    console.log(this.address());

    //get connections takes callback function
    this.getConnections(function(err, count){
        if(err){
            console.log("Error getting connections");
        }else{
            console.log("connections count: " + count);
        }
    });

    connectionListener.on('end', function(){
        console.log("disconnected");
    });
    //write to the connected socket
    connectionListener.write('heyy\r\n');

});

server.on('error', function(err){
    console.log('Server error: ' + err);
});

server.on('data', function(data){
    console.log(data.toString());
});
/*
 listen()
 */
server.listen(3390, function(){
    console.log('server is listening');
});
