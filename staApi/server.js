const http 				= require('http');
const app 				= require('./app'); // app file include
const globalVariable 	= require('./nodemon.js');
const port = process.env.PORT || globalVariable.port;
console.log("This app is working on port => ",port)

const server = http.createServer(app);

server.listen(port);


