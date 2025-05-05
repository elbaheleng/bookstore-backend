//import express
const express = require('express')
const userController = require('./controllers/userController')

//create instance to acces the class router in express
const route = new express.Router()

//path for register
route.post("/register",userController.registerController)
route.post("/login",userController.loginController)//path for login


//routes export
module.exports = route