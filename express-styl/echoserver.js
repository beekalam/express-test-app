var net = require('net');

var server = net.createServer(function(connectionListener){
    //get connection count
    this.getConnections(function(err, count){
        if(err){
            console.log('Error getting connections');
        }else{
            //send out info for this socket
            connectionListener.write('connections to server: ' +  count + '\n');
        }
    });

    connectionListener.on('end', function(){
        console.log('disconnected');
    });

    //Make sure there is somethig happeing
    connectionListener.write("heyo\r\n");

    connectionListener.on('data', function(data){
        console.log('message for you sir: ' + data);
    });

    //Handle connection errors
    connectionListener.on('error', function(err){
        console.log('server error: ' + err);
    });
});

server.on('error', function(err){
    console.log('Server error: ' + err);
});

server.on('error', function(err){
    console.log(data.toString());
});


server.listen(8181, function(){
    console.log('server is listening');
});
