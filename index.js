
require('dotenv').config() // import dotenv and from that, use config() to load env variables
const express = require('express')//import express library
const cors = require('cors')//import cors 
const route = require('./routes')//import route
require('./databaseconnection') // import databaseconnection.js file


//create the server using express method
const bookstoreServer = express()

//the following order is important
bookstoreServer.use(cors())//connet the server with frontend using cors
bookstoreServer.use(express.json())//to parse JSON data, we use middleware
bookstoreServer.use(route)// tell rserver to use route
bookstoreServer.use('/upload',express.static('./uploads'))// to export the uploads folder from the server side


//create port
PORT = 4000 || process.env.PORT

// make server listen to port
bookstoreServer.listen(PORT, ()=>{
    console.log(`server running successfully at port ${PORT}`);
    
})