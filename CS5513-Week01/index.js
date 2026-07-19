// CS55.13 Week 01

// use http package (shared code) from node.js
const myhttp = require( "http");

// use http package createServer() that runs a web server
let myserver = myhttp.createServer(
    //createServer() uses our function to run when a request comes in
    function ( myrequest, myresponse) {
        console.log ( myrequest.url );

        let mytext;
        if ( myrequest.url === '/jerry' ) {
            mytext = "You know, the very fact that you oppose this makes me think I’m onto something.";
        } else if ( myrequest.url === '/elaine' ) {
            mytext = "Yada yada yada.";
        } else if ( myrequest.url === '/george' ) {
            mytext = "Yeah, I`m a great quitter. It`s one of the few things I do well. I come from a long line of quitters.";
        } else if ( myrequest.url === '/kramer' ) {
            mytext = "Do you have any idea how much time I waste in this apartment?";
        } else {
            mytext = "Serenity now!";
        }

        // writeHead() creates an http response header. including the status code (200 OK)
        // writeHead() takes 2 args: http status code, MIME type
        myresponse.writeHead ( 200, { "content-type": "text/plain" } );

        //end() return
        myresponse.end ( mytext );
    }
);

//ask http to start listening on a tcp port for incoming http requests
// listen() takes 2 args: tcp port #, string of the ip address to listen (0.0.0.0)
myserver.listen ( 8080, "127.0.0.1" )
