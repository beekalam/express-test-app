var http = require("http");
var cluster = require("cluster");
var numCPUS = require("os").cpus().length;

//console.log("process.id: " + process.pid);
var app = [];

if (cluster.isMaster){
    for(var i =0; i < numCPUS; i++){
        console.log("Forking child");
        cluster.fork();
    }
}else{
    http.createServer(function(request, response){
        console.log(process.pid + ": request for " + request.url);

        if(process.pid in app){
            app[process.pid].push( Math.random());
        }else{
            app[process.pid] = [];
        }
        console.log("---");
        response.writeHead(200);
        var res = "process.id: " + process.pid + "<br/>";
        res += "request.url: " + request.url + "<br/>";
        console.log("length: " + app[process.pid].length);
        response.end(res);
    }).listen(8000);
}
