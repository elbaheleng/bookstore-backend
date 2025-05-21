const books = require("../model/bookModel");
//to add books
exports.addBookController = async (req, res) => {
    //console.log('inside addBookController');

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
//to get home books
exports.getHomeBookController = async (req, res) => {
    try {
        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}
// get all books
exports.getAllBookController = async (req, res) => {
    //console.log(req.query);
    const searchkey = req.query.search
    const email = req.payload

    try {
        const query = {
            title: {
                $regex: searchkey, $options: "i"
            },
            userMail: { $ne: email }
        }
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}

//to get a particular book
exports.getABookController = async (req, res) => {
    const { id } = req.params
   // console.log(id);

    try {
        const aBooks = await books.findOne({ _id: id })
        res.status(200).json(aBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}
//--------------------------------------------------------
//------------admin--------------

//to get all books
exports.getAllBookAdminController = async (req, res) => {
    try {
        const allExistingBooks = await books.find()
        res.status(200).json(allExistingBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}

//to approve a book
exports.approveBookController = async (req, res) => {
    const { _id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImage, status, userMail, bought } = req.body
    console.log(_id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImage, status, userMail, bought);
    
    try {
        const existingBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImage, status: "approved", userMail, bought }, { new: true })
        //await existingBook.save() // here optional
        res.status(200).json(existingBook)

    } catch (error) {
        res.status(500).json(error)

    }
}