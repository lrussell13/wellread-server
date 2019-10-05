const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiaWF0IjoxNTY5OTgwNzg4LCJzdWIiOiJkZW1vIn0.LieePZkJqhQyEZ5Q77BAY0a5CtfDrEN-xRfPgsP734E'
const knex = require('knex');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/user.fixtures');

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

    describe('POST BOOK', () => {
        const testUsers = makeUsersArray();

        beforeEach('insert Users', () => {
            return db 
            .into('wellread_users')
            .insert(testUsers)
        })

        it('responds with 201', () => {
            const newBook = {
            title: 'new title',
            author: 'new author',
            oclc: 1987289,
            isbn: 9012098312,
            cover_i: 912782312
            }

            return supertest(app)
            .post('/api/books')
            .send(newBook)
            .set({ 'Authorization': `Bearer ${token}`})
            .expect(201)
        })
    })
})