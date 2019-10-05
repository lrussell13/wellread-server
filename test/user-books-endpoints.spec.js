const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiaWF0IjoxNTY5OTgwNzg4LCJzdWIiOiJkZW1vIn0.LieePZkJqhQyEZ5Q77BAY0a5CtfDrEN-xRfPgsP734E'
const knex = require('knex');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/user.fixtures');
const { makeUserBooksArray } = require('./fixtures/user-books.fixtures');
const { makeBooksArray } = require('./fixtures/books.fixtures');
const { makeUserBooksResults } = require('./fixtures/user-books-results.fixtures');
 
describe('user-books-endpoints', function(){
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

    describe('GET USER BOOKS', () => {
      context('Given there are books', () => {
        const testUsers = makeUsersArray();
        const testUserBooks = makeUserBooksArray();
        const testBooks = makeBooksArray();
        const expectedResults = makeUserBooksResults();

        beforeEach('insert Users', () => {
          return db 
            .into('wellread_users')
            .insert(testUsers)
        })

        beforeEach('insert Books', () => {
          return db 
            .into('wellread_books')
            .insert(testBooks)
        })

        beforeEach('insert Users Books', () => {
          return db 
            .into('wellread_users_books')
            .insert(testUserBooks)
        })

        it('responds with 200 and all user-books', () => {
          return supertest(app)
            .get('/api/userBooks')
            .set({ 'Authorization': `Bearer ${token}`})
            .expect(200, expectedResults)
        })
      })
    })

    describe('POST USER BOOKS', () => {
      const testUsers = makeUsersArray();
      const testBooks = makeBooksArray();

      beforeEach('insert Users', () => {
        return db 
          .into('wellread_users')
          .insert(testUsers)
      })

      beforeEach('insert Books', () => {
        return db 
          .into('wellread_books')
          .insert(testBooks)
      })

      it('responds with 201 and the book', () => {
        const newUserBook = {
          book_id: 1,
          book_status: 2
        }

        return supertest(app)
          .post('/api/userBooks')
          .send(newUserBook)
          .set({ 'Authorization': `Bearer ${token}`})
          .expect(201)
      })
    })

    describe('DELETE /:id', () => {
      const testUsers = makeUsersArray();
      const testUserBooks = makeUserBooksArray();
      const testBooks = makeBooksArray();

      beforeEach('insert Users', () => {
        return db 
          .into('wellread_users')
          .insert(testUsers)
      })

      beforeEach('insert Books', () => {
        return db 
          .into('wellread_books')
          .insert(testBooks)
      })

      beforeEach('insert Users Books', () => {
        return db 
          .into('wellread_users_books')
          .insert(testUserBooks)
      })

      it('responds 204', () => {
        return supertest(app)
          .delete('/api/userBooks/1')
          .set({ 'Authorization': `Bearer ${token}`})
          .expect(204)
      })
    })

    describe('PATCH /:id', () => {
      const testUsers = makeUsersArray();
      const testUserBooks = makeUserBooksArray();
      const testBooks = makeBooksArray();

      beforeEach('insert Users', () => {
        return db 
          .into('wellread_users')
          .insert(testUsers)
      })

      beforeEach('insert Books', () => {
        return db 
          .into('wellread_books')
          .insert(testBooks)
      })

      beforeEach('insert Users Books', () => {
        return db 
          .into('wellread_users_books')
          .insert(testUserBooks)
      })

      it('Responds 204', () => {
        const newFields = {
          book_status: 3
        }

        return supertest(app)
        .patch('/api/userBooks/1')
        .send(newFields)
        .set({ 'Authorization': `Bearer ${token}`})
        .expect(204)
      })
    })
})
