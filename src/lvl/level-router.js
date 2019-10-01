require('dotenv').config();
const express = require('express');
const levelService = require('./level-service');
const { requireAuth } = require('../middleware/jwt-auth')

const lvlRouter = express.Router();
const bodyParser = express.json();


lvlRouter
    .route('/')
    .get(requireAuth, (req, res) => {
        const knex = req.app.get('db');
        levelService.getUserLvlByUserId(knex, req.user.id)
        .then(lvl => {
            res.json(lvl);
        });
    })
    .post(bodyParser, (req, res, next) => {
        const knex = req.app.get('db');
        const { user_id } = req.body;
        const newUserLvl= { user_id };

        for (const [key, value] of Object.entries(newUserLvl))
            if (value == null){
                return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })}

        levelService.insertUserLvl(knex, newUserLvl)
        .then(() => {
            res.status(201).end();
        })
        .catch(next)
    })

lvlRouter
    .route('/:id')
    .all(requireAuth)
    .get((req, res) => {
        const knex = req.app.get('db');
        levelService.getUserBooksById(knex, req.params.id)
        .then(books => {
            res.json(books);
        });
    })
    .delete((req, res, next) => {
        levelService.deleteUserBook(req.app.get('db'), req.params.id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { lvl } = req.body;
        const updatedUserLvl = { lvl };

        if (!updatedUserLvl)
            return res.status(400).json({
            error: {
                message: `Request body must contain lvl`
            }
        })

        levelService.updateUserLvl(req.app.get('db'), updatedUserLvl, req.params.id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = lvlRouter;