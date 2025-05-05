const users = require("../model/userModel");
const jwt = require('jsonwebtoken')

//register
exports.registerController = async (req, res) => {
    //logic
    const { username, email, password } = req.body
    //console.log(username, email, password);
    try {

        const existingUser = await users.findOne({ email })// only email because key and value same

        if (existingUser) {
            res.status(409).json('Already user exist')
        } else {
            const newUser = new users({// kay and value same, so written only one, newUser is ready in server
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
            res.status(404).json("Incorrect email or password") // user doesnot exist
        }
    } catch (error) {
        res.status(500).json(error)
    }

}