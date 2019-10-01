require('dotenv').config();
const express = require('express');
const booksService = require('./books-service');
const { requireAuth } = require('../middleware/jwt-auth')

const booksRouter = express.Router();
const bodyParser = express.json();

booksRouter
    .route('/')
    .all(requireAuth)
    .get((req, res) => {
        const knex = req.app.get('db');
        booksService.getBooks(knex)
        .then(books => {
            res.json(books);
        });
    })
    .post(bodyParser, (req, res, next) => {
        const knex = req.app.get('db');
        const { title, author, cover_i, isbn, oclc } = req.body;
        const newBook = { title, author };

        for (const [key, value] of Object.entries(newBook))
            if (value == null){
                return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })}
        
        newBook.cover_i = cover_i;   
        newBook.isbn = isbn;  
        newBook.oclc = oclc;  

        booksService.insertBook(knex, newBook)
        .then(book => {
            res
            .status(201)
            .json(book) 
        })
        .catch(next)
    })

booksRouter
    .route('/:id')
    .all(requireAuth)
    .delete((req, res, next) => {
        booksService.deletebook(req.app.get('db'), req.params.id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = booksRouter;