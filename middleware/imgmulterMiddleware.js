const multer = require('multer') //import multer


const storage = multer.diskStorage({
    destination: (req, file, callback) => { // path to store the file
        callback(null, './uploads')
    },
    filename: (req, file, callback) => { // name in which the file is to be stored
        const fname = `image-${file.originalname}`
        callback(null, fname)
    }

})

const fileFilter = (req, file, callback) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        callback(null, true) // accept the file if it is png,jpg or jpeg
    } else {
        callback(null, false)
        callback(new Error('Upload only png, jpg, jpeg files'))

    }
}

//create config
const multerConfig = multer({
    storage, //key value same, so only one
    fileFilter
})

module.exports = multerConfig