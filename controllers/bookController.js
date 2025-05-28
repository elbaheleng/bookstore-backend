const books = require("../model/bookModel");
const stripe = require('stripe')('sk_test_51RSxyzBByBIEVjlsnfjxRcAhe04Mkkjz2vtaNiMaoXqMU2kum8Aa9ysZNZBgXaCN5CymvnnULWchpSMf6B2V5GPq00I7u25pDe');
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
//to get all books added by user
exports.getAllUserAddedBooksController = async (req, res) => {
    const email = req.payload
    try {
        const allBooksByUser = await books.find({ userMail: email })
        res.status(200).json(allBooksByUser)
    } catch (error) {
        res.status(500).json(error)

    }
}
//to get all books bought by user
exports.getAllUserBoughtBookController = async (req, res) => {
    const email = req.payload
    try {
        const allBooksBoughtByUser = await books.find({ bought: email })
        res.status(200).json(allBooksBoughtByUser)
    } catch (error) {
        res.status(500).json(error)

    }
}


exports.deleteAUserBookController = async (req, res) => {
    const { id } = req.params
    try {
        const deleteBook = await books.findByIdAndDelete({ _id: id })
        res.status(200).json("Book deleted successfully")
    } catch (error) {
        res.status(500).json(error)

    }
}
//payment controller
exports.makePaymentController = async (req, res) => {
    const { booksDetails } = req.body
    const email = req.payload
    //console.log(booksDetails);
    
    try {
        const existingBook = await books.findByIdAndUpdate({ _id: booksDetails._id }, {
            title: booksDetails.title,
            author: booksDetails.author,
            noofpages: booksDetails.noofpages,
            imageurl: booksDetails.imageurl,
            price: booksDetails.price,
            dprice: booksDetails.dprice,
            abstract: booksDetails.abstract,
            publisher: booksDetails.publisher,
            language: booksDetails.language,
            isbn: booksDetails.isbn,
            category: booksDetails.category,
            uploadedImage: booksDetails.uploadedImage,
            status: "sold",
            userMail: booksDetails.userMail,
            bought: email
        }, { new: true })
        console.log(existingBook);
        
        //create stripe checkout session
        const line_item = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: booksDetails.title,
                    description: `${booksDetails.author} | ${booksDetails.abstract}`,
                    images: [booksDetails.imageurl],
                    metadata: {
                        title: booksDetails.title,
                        author: booksDetails.author,
                        noofpages:` ${booksDetails.noofpages}`,
                        imageurl: booksDetails.imageurl,
                        price: `${booksDetails.price}`,
                        dprice: `${booksDetails.dprice}`,
                        abstract: booksDetails.abstract.slice(0,20),
                        publisher: booksDetails.publisher,
                        language: booksDetails.language,
                        isbn: booksDetails.isbn,
                        category: booksDetails.category,
                       // uploadedImage: booksDetails.uploadedImage,
                        status: "sold",
                        userMail: booksDetails.userMail,
                        bought: email
                    }
                },
                unit_amount: Math.round(booksDetails.dprice*100) // multiplied by 100 to convert cents to dollar, math.round to round to nearest integer
            },
            quantity: 1
        }]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], //purchased using card
            line_items: line_item, // details of produt that is being purchased
            mode: "payment",//make payment  or subscription or setup
            success_url: 'https://bookstore-frontend-khaki.vercel.app/payment-success',//url to be shown if payment is successful
            cancel_url: 'https://bookstore-frontend-khaki.vercel.app/payment-error'//url to be shown if payment is failed
        });
        console.log(session);
        
        res.status(200).json({sessionId:session.id })
    
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