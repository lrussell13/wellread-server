require('dotenv').config();
const express = require('express');
const xss = require('xss');
const userBooksService = require('./user-books-service');
const { requireAuth } = require('../middleware/jwt-auth')

const userBooksRouter = express.Router();
const bodyParser = express.json();

userBooksRouter
    .route('/')
    .all(requireAuth)
    .get((req, res) => {
        const knex = req.app.get('db');
        userBooksService.getUserBooksByUserId(knex, req.user.id)
        .then(books => {
            res.json(books);
        });
    })
    .post(bodyParser, (req, res, next) => {
        const knex = req.app.get('db');
        const { book_id, book_status } = req.body;
        const newUserBook = { book_id, book_status };

        for (const [key, value] of Object.entries(newUserBook))
            if (value == null){
                return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })}
        
        newUserBook.rating = req.body.rating;
        newUserBook.notes = req.body.notes;
        newUserBook.user_id = req.user.id;   

        userBooksService.insertUserBook(knex, newUserBook)
        .then(book => {
            res
            .status(201)
            .json(book);
        })
        .catch(next)
    })

userBooksRouter
    .route('/:id')
    .all(requireAuth)
    .get((req, res) => {
        const knex = req.app.get('db');
        userBooksService.getUserBooksById(knex, req.params.id)
        .then(books => {
            res.json(books);
        });
    })
    .delete((req, res, next) => {
        userBooksService.deleteUserBook(req.app.get('db'), req.params.id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { book_id, book_status, rating, notes } = req.body;
        const updatedUserBook = { book_id, book_status, rating, notes };

        const numberOfValues = Object.values(updatedUserBook).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
            error: {
                message: `Request body must contain book_id, book_status, rating, notes`
            }
        })

        userBooksService.updateUserBook(req.app.get('db'), updatedUserBook, req.params.id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = userBooksRouter;