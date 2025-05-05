//import mongoose
const mongoose = require('mongoose')

const connectionstring = process.env.DATABASE

mongoose.connect(connectionstring).then(()=>{ // connect() method from mongoose is used to connect db, response of connect() is a promise
    console.log('Mongodb connected successfully');
    
}).catch((err)=>{
    console.log(`mongodb connection failed due to${err}`);
    
})