//import express
const express = require('express')
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const multerConfig = require('./middleware/imgmulterMiddleware')

//create instance to acces the class router in express
const route = new express.Router()

//path for register
route.post("/register",userController.registerController)
route.post("/login",userController.loginController)//path for login  
route.post("/google-login",userController.googleLoginController) // path for google login
route.post("/add-book", jwtMiddleware,multerConfig.array('uploadedImages',3) ,bookController.addBookController) // path for adding books, uploadedImages itselt should be the name used in fronend


//routes export
module.exports = route