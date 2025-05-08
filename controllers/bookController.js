const books = require("../model/bookModel");

exports.addBookController = async (req, res) => {
    console.log('inside addBookController');

    const { title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category } = req.body
    // console.log( title,author,noofpages,imageurl,price,dprice,abstract,publisher,language,isbn,category);

    uploadedImage = []
    req.files.map((item) => uploadedImage.push(item.filename))
    // console.log(uploadedImages);

    const email = req.payload

    try {
        const existingBook = await books.findOne({ title, userMail: email })
        if (existingBook) {
            res.status(401).json('You have already added the book.')
        } else {
            const newBook = new books({
                title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImage, userMail: email
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}