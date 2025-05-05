const users = require("../model/userModel");

//register
exports.registerController = async (req, res) => {
    //logic
    const { username, email, password } = req.body
    console.log(username, email, password);
    try {

        const existingUser = await users.findOne({ email })// only email because key and value same

        if (existingUser) {
            res.status(400).json('Already user exist')
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