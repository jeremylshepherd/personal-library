/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const Book = require('../models/Books');

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
    const errMessage = (res, err) => res.json({ message: `ERROR: ${err}` });
    const getBook = (req, res) => {
        Book.findOne({ _id: req.params.id }, (err, book) => {
            if (err || !book) {
                res.send('no book exists');
            } else {
                res.json(book);
            }
        });
    };

    const postBook = (req, res) => {
        let title = req.body.title;
        Book.findOne({ title: title }, (err, book) => {
            if (err) return errMessage(res, err);
            if (book) return res.json(book);
            let newBook = new Book({ title: title });
            newBook.save((err, record) => {
                if (err) return errMessage(res, err);
                res.json(record);
            });
        });
    };

    const postBookComment = (req, res) => {
        Book.findOne({ _id: req.params.id }, (err, book) => {
            if (err) return errMessage(res, err);
            if (!book) return res.status(400).send('no book exists');
            book.comments.push(req.body.comment);
            book.commentcount = book.comments.length;
            book.save((err, result) => {
                if (err) return errMessage(res, err);
                res.json(result);
            });
        });
    };

    //ROUTES
    app.route('/api/books')
        .get(function(req, res) {
            Book.find({}, (err, books) => {
                if (err) return errMessage(res, err);
                res.json(books);
            });
        })

        .post(function(req, res) {
            const title = req.body.title;
            if (title === undefined) return res.status(400).send('You must enter a title');
            postBook(req, res);
        })

        .delete(function(req, res) {
            Book.deleteMany(err => {
                if (err) return errMessage(res, err);
                res.send('complete delete successful');
            });
        });

    app.route('/api/books/:id')
        .get(function(req, res) {
            getBook(req, res);
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        })

        .post(function(req, res) {
            postBookComment(req, res);
        })

        .delete(function(req, res) {
            const bookid = req.params.id;
            Book.findOneAndRemove({ _id: bookid }, (err, book) => {
                if (err) return errMessage(res, err);
                res.send('delete successful');
            });
        });

    app.route('/api/books/:id/comments').get((req, res) => {
        Book.findOne({ _id: req.params.id })
            .populate('comments')
            .exec((err, book) => {
                if (err) return errMessage(res, err);
                res.json(book);
            });
    });
};
