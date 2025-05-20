//import express
const express = require('express')
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const multerConfig = require('./middleware/imgmulterMiddleware')
const jobController = require('./controllers/jobController')

//create instance to acces the class router in express
const route = new express.Router()

//path for register
route.post("/register",userController.registerController)
route.post("/login",userController.loginController)//path for login  
route.post("/google-login",userController.googleLoginController) // path for google login
route.get('/all-home-book',bookController.getHomeBookController)//path to get all home books
//------------------USER----------------
route.post("/add-book", jwtMiddleware,multerConfig.array('uploadedImages',3) ,bookController.addBookController) // path for adding books, uploadedImages itselt should be the name used in fronend
route.get('/all-books',jwtMiddleware,bookController.getAllBookController)//path to get all books
route.get('/view-book/:id',bookController.getABookController)//path to view a book
//------------------ADMIN----------------
route.get('/admin-all-books',jwtMiddleware, bookController.getAllBookAdminController)// path to get all books for admin
route.put('/approve-book',jwtMiddleware, bookController.approveBookController)// path to approve a book
route.get('/all-users',jwtMiddleware,userController.getAllUsersController)//path to get all users

route.post("/add-job", jobController.addJobController)



//routes export
module.exports = route