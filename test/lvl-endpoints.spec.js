const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiaWF0IjoxNTY5OTgwNzg4LCJzdWIiOiJkZW1vIn0.LieePZkJqhQyEZ5Q77BAY0a5CtfDrEN-xRfPgsP734E'
const knex = require('knex');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/user.fixtures');
const { makeUserLvlArray } = require('./fixtures/user-lvl.fixtures');

describe('lvl-endpoints', function(){
    let db;

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup',() => db.raw('TRUNCATE wellread_users_books, wellread_books, wellread_users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE wellread_users_books, wellread_books, wellread_users RESTART IDENTITY CASCADE'))

    describe('GET USER LVL', () => {
        const testUsers = makeUsersArray();
        const testLvl = makeUserLvlArray();

        beforeEach('insert Users', () => {
          return db 
            .into('wellread_users')
            .insert(testUsers)
        })

        beforeEach('insert Books', () => {
          return db 
            .into('wellread_lvl')
            .insert(testLvl)
        })

        it('responds with 200 and user lvl', () => {
            return supertest(app)
            .get('/api/lvl')
            .set({ 'Authorization': `Bearer ${token}`})
            .expect(200, testLvl)
        })
    })

    describe('POST USER LVL', () => {
        const testUsers = makeUsersArray();

        beforeEach('insert Users', () => {
            return db 
            .into('wellread_users')
            .insert(testUsers)
        })

        it('responds with 201', () => {
            const newUserLvl = {
            user_id: 1
            }

            return supertest(app)
            .post('/api/lvl')
            .send(newUserLvl)
            .set({ 'Authorization': `Bearer ${token}`})
            .expect(201)
        })
    })

    describe('PATCH /:id', () => {
        const testUsers = makeUsersArray();
        const testLvl = makeUserLvlArray();

        beforeEach('insert Users', () => {
          return db 
            .into('wellread_users')
            .insert(testUsers)
        })

        beforeEach('insert Books', () => {
          return db 
            .into('wellread_lvl')
            .insert(testLvl)
        })

        const updatedLvl = {
            lvl: 2
        }

        it('responds with 204', () => {
            return supertest(app)
            .patch('/api/lvl/1')
            .send(updatedLvl)
            .set({ 'Authorization': `Bearer ${token}`})
            .expect(204)
        })
    })
})