const mongoose = require('mongoose') // import mongoose

//create schema
const userSchema = new mongoose.Schema({ //Schema is a class in mongoose
username:{
    type: String,
    required: true
},
email:{
    type: String,
    required: true
},
password:{
    type: String,
    required: true
},
profile:{
    type: String,
    default: ""
},
bio:{
    type: String,
    default: "Bookstore user"
}

})

const users = mongoose.model("users",userSchema) // users is the name of collection
module.exports = users