const dgrame = require('dgram');
const server = dgrame.createSocket('udp4');
server.on('error', (err) =>{
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () =>{
    var address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});
server.bind(41234);

// var express = require('express');
// var path = require('path');
// var http =  require('http');

// var app = express();

// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.all('*', function(req, res){
//     res.render('index', {msg:'welcome to the practical Node.js!'});
// });

// http.createServer(app)
//     .listen(
//         app.get('port'),
//         function(){
//             console.log("Express.js server listening on port" +  app.get('port'));
//         }
//     );
