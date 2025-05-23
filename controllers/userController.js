const users = require("../model/userModel");
const jwt = require('jsonwebtoken')

//register
exports.registerController = async (req, res) => {
    const { username, email, password } = req.body
    try {

        const existingUser = await users.findOne({ email })// only email because key and value same

        if (existingUser) {
            res.status(409).json('Already user exist')
        } else {
            const newUser = new users({// key and value same, so written only one, newUser is ready in server
                username,
                email,
                password,
            })
            await newUser.save()// newUser is added to mongoDB
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}
//login
exports.loginController = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })// only email because key and value same
        if (existingUser) {
            if (existingUser.password == password) {
                const token = jwt.sign({ userMail: existingUser.email }, 'secretkey')
                res.status(200).json({existingUser,token})
            } else {
                res.status(401).json("Incorrect email or password") // password doesnot match
            }
        } else {
            res.status(404).json("User doesnot exist") // user doesnot exist
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//google login
exports.googleLoginController = async (req,res) => {
    const { username, email, password, photo } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser){
            const token = jwt.sign({ userMail: existingUser.email }, 'secretkey')
            res.status(200).json({existingUser,token})
        } else {
            const newUser = new users({// key and value same, so written only one, newUser is ready in server
                username,
                email,
                password,
                profile : photo
            })
            await newUser.save()
            const token = jwt.sign({ userMail: newUser.email }, 'secretkey')
            res.status(200).json({newUser,token})
        }

    } catch (error) {
        res.status(500).json(error)
    }
    
}

// get all users
exports.getAllUsersController = async (req,res) =>{
    const email = req.payload
    try {
        const allusers = await users.find({email:{$ne:email}})
        res.status(200).json(allusers)
    } catch (error) {
         res.status(500).json(error)
    }
}

//update admin profile
exports.updateAdminProfileController = async (req,res) =>{
    const {username, password, profile} = req.body
    const prof = req.file ? req.file.filename : profile
    const email = req.payload
     try {
        const adminDetails = await users.findOneAndUpdate({email},{username, email, password, profile:prof},{new:true})
        await adminDetails.save()
        res.status(200).json(adminDetails)
    } catch (error) {
         res.status(500).json(error)
    }
}