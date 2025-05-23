//import express
const express = require('express')
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const multerConfig = require('./middleware/imgmulterMiddleware')
const jobController = require('./controllers/jobController')
const appController = require('./controllers/appController')
const pdfmulterConfig = require('./middleware/pdfmulterMiddleware')

//create instance to acces the class router in express
const route = new express.Router()

//path for register
route.post("/register",userController.registerController)
route.post("/login",userController.loginController)//path for login  
route.post("/google-login",userController.googleLoginController) // path for google login
route.get('/all-home-book',bookController.getHomeBookController)//path to get all home books
route.get('/all-jobs',jobController.getAllJobsController)//path to get all jobs
//------------------USER----------------
route.post("/add-book", jwtMiddleware,multerConfig.array('uploadedImages',3) ,bookController.addBookController) // path for adding books, uploadedImages itselt should be the name used in fronend
route.get('/all-books',jwtMiddleware,bookController.getAllBookController)//path to get all books
route.get('/view-book/:id',bookController.getABookController)//path to view a book
route.post("/apply-job",jwtMiddleware,pdfmulterConfig.single('resume'),appController.addApplicationController)//path to apply for a job
//------------------ADMIN----------------
route.get('/admin-all-books',jwtMiddleware, bookController.getAllBookAdminController)// path to get all books for admin
route.put('/approve-book',jwtMiddleware, bookController.approveBookController)// path to approve a book
route.get('/all-users',jwtMiddleware,userController.getAllUsersController)//path to get all users
route.post("/add-job", jobController.addJobController)//path to add a new job
route.delete("/delete-job/:id",jobController.deleteAJobController)//path to delete a job
route.get("/all-applications", appController.getAllApplicationsController)// path to get all job applications
route.put('/admin-profile-update',jwtMiddleware,multerConfig.single('profile'),userController.updateAdminProfileController)//to update admin profile


//routes export
module.exports = route