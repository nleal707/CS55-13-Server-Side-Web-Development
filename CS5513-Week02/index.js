// CS55.13 Week 02

// use http package (shared code) from node.js
const myhttp = require( "http" );

// load the core node filesystem module, using js promises instead of callback
const fileSystem = require ( "fs" ).promises;

// create a function to respond to http requests
const requestListener = function ( myrequest, myresponse) {
    console.log ( myrequest.url );

    if ( myrequest.url === '/' ) {
        // check request url, if root, return html file
        // special variable __dirname has absolute path of where node code is running
        fileSystem.readFile( __dirname + "/page.html" )
            .then(
                // arrow notation. same as: function(contents) {...}
                contents => {
                    // setup http response header entry
                    myresponse.setHeader( "Content-Type", "text/html; charset=UTF-8" );
                    // return 200 OK http status code
                    myresponse.writeHead( 200 );
                    // send back file contents + close response
                    myresponse.end( contents );
                }
        );
    } else {
        fileSystem.readFile( __dirname + "/data.json" )
            .then(
                // arrow notation. same as: function(contents) {...}
                contents => {
                    // setup http response header entry
                    myresponse.setHeader( "Content-Type", "application/json; charset=UTF-8" );
                    // return 200 OK http status code
                    myresponse.writeHead( 200 );
                    // send back file contents + close response
                    myresponse.end( contents );
                }
        );
    }
};

// use http package createServer() that runs a web server
let myserver = myhttp.createServer(
    //createServer() uses our function to run when a request comes in
    requestListener
);

//ask http to start listening on a tcp port for incoming http requests
// listen() takes 2 args: tcp port #, string of the ip address to listen (0.0.0.0)
myserver.listen ( 8080, "127.0.0.1" )
