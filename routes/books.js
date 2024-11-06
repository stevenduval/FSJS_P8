var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET books listing */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));

/* GET new book form */
router.get('/new', function(req, res) {
  res.render('new-book');
});

/* POST create book */
router.post('/new', asyncHandler(async (req, res) => {
  console.log(req);
  // creating entry into Article modle using request body
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  }
  catch (error) {
    //   if(error.name === "SequelizeValidationError") { // checking the error
    //     book = await book.build(req.body);
    //     res.render("articles/new", { article, errors: error.errors, title: "New Article" })
    //   } else {
    //     throw error;
    //   }  
  }
}));

/* GET books listing */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book });
}));

/* POST update book */
router.post('/:id', asyncHandler(async (req, res) => {
  console.log(req);
  // creating entry into Article modle using request body
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body)
    res.redirect("/books");
  }
  catch (error) {
    //   if(error.name === "SequelizeValidationError") { // checking the error
    //     book = await book.build(req.body);
    //     res.render("articles/new", { article, errors: error.errors, title: "New Article" })
    //   } else {
    //     throw error;
    //   }  
  }
}));

/* POST delete book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/books");
}));

module.exports = router;