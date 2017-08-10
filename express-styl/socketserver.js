var net = require('net');
var server = net.createServer(connectionListener);

server.listen(8181,'127.0.0.1');

function connectionListener(conn){
    console.log('new client connected');
    //greet the client
    conn.write('hello');

    //read what the client has tosay
    // and respond
    conn.on('readable', function(){
        var data = JSON.parse(this.read());
        if(data.name){
            this.write('hello '+ data.name);
        }
    });

    //handle errors
    conn.on('error',function(e){
        console.log('' + e);
    });
}
