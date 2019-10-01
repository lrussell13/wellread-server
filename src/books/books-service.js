const booksService = {
    getBooks(knex){
        return knex.from('wellread_books').select('*')
    },
    deleteBook(knex, id){
        return knex('wellread_books')
          .where({ id })
          .delete()
    },
    insertBook(knex, newBook){
        return knex
            .insert(newBook)
            .into('wellread_books')
            .returning('*')
            .then(rows => {
                return rows[0]
        })
    }
}

module.exports = booksService;