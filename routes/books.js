var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var createError = require('http-errors');
var { Op } = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // will forward to global error handler since error is specified
            next(error);
        }
    }
}

// GET books depending upon route
router.get(['/', '/search'], asyncHandler(async (req, res) => {
    // get search query query param
    const query = req.query.q || null;
    // get page query param if exists, otherwise set to 1
    const page = req.query.page || 1;
    // limit 5 results per page
    const limit = 5;
    // set offset so we know where to start
    const offset = (page - 1) * limit;
    // set var to store where conditions depending upon path
    let where = {};
    // if on search path
    if (req.path === '/search') {
        // if query is empty dont do anything
        if (!query) {
            return false;
        }
        // set where condition to use when on search path
        where = {
            [Op.or]:
                [
                    { title: { [Op.like]: `${query}%` } },
                    { author: { [Op.like]: `${query}%` } },
                    { genre: { [Op.like]: `${query}%` } },
                    { year: { [Op.like]: `${query}%` } }
                ]
        }
    }
    // retrieve data using limit and offset from Book Model and count the results so we know how many pagination buttons to create
    const { count, rows } = await Book.findAndCountAll({
        where,
        limit,
        offset,
    });
    // render index view, pass data
    res.render('index', { books: rows, currPage: page, pageCount: Math.ceil(count / limit), path: req, query });
}));

/* GET new book form */
router.get('/new', function (req, res) {
    res.render('new-book', { book: {} });
});

/* POST create book */
router.post('/new', asyncHandler(async (req, res) => {
    // var to store book instance in
    let book;
    try {
        // try creating a book, if successful redirect to /books
        book = await Book.create(req.body);
        res.redirect("/books");
    }
    catch (error) {
        // catch Sequelize Validation Error
        if (error.name === "SequelizeValidationError") {
            // create non persistent instance that we can pass back to new-book
            book = await Book.build(req.body);
            // redirect back to new book form use instance data above and display validation errors
            res.render("new-book", { book, errors: error.errors })
        } else {
            // throw Server Error
            throw error;
        }
    }
}));

/* GET books listing */
router.get('/:id', asyncHandler(async (req, res, next) => {
    // find book by primary key
    const book = await Book.findByPk(req.params.id);
    // if id in path is a book that can be found
    if (book) {
        // render update-book path and pass it book that was found
        res.render('update-book', { book });
    } else {
        // will create custom 404 error for when id of book doesnt exist
        next(createError(404, 'Sorry! We couldn\'t find the book you were looking for.'));
    }
}));

/* POST update book */
router.post('/:id', asyncHandler(async (req, res) => {
    // var to store book instance in
    let book;
    try {
        // find book by primary key, try to update, if successful redirect to /books path
        book = await Book.findByPk(req.params.id);
        await book.update(req.body);
        res.redirect("/books");
    }
    catch (error) {
        // catch Sequelize Validation Error
        if (error.name === "SequelizeValidationError") {
            // create non persistent instance that we can pass back to update-book
            book = await Book.build(req.body);
            // set id so we can ensure correct book gets updated
            book.id = req.params.id;
            // redirect back to update book form use instance data above and display validation errors
            res.render("update-book", { book, errors: error.errors })
        } else {
            // throw Server Error
            throw error;
        }
    }
}));

/* POST delete book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
    // find book by primary key using id from url
    const book = await Book.findByPk(req.params.id);
    // delete the book
    await book.destroy();
    // redirect to /books path when successful
    res.redirect("/books");
}));

// export so we can use in app.js file
module.exports = router;