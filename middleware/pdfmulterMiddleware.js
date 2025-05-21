const multer = require('multer') //import multer


const storage = multer.diskStorage({
    destination: (req, file, callback) => { // path to store the file
        callback(null, './pdfUploads')
    },
    filename: (req, file, callback) => { // name in which the file is to be stored
        const fname = `resume-${file.originalname}`
        callback(null, fname)
    }

})

const fileFilter = (req, file, callback) => {
    if (file.mimetype == 'application/pdf') {
        callback(null, true) // accept the file if it is pdf
    } else {
        callback(null, false)
        callback(new Error('Upload only pdf files'))

    }
}

//create config
const pdfmulterConfig = multer({
    storage, //key value same, so only one
    fileFilter
})

module.exports = pdfmulterConfig