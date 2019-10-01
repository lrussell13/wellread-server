const userBooksService = {
    getUserBooksByUserId(knex, user_id){
        return knex.from('wellread_users_books')
        .select(['wellread_users_books.*', 'wellread_books.title', 'wellread_books.author', 'wellread_books.isbn', 'wellread_books.cover_i', 'wellread_books.oclc'])
        .join('wellread_books', 'wellread_users_books.book_id', '=', 'wellread_books.id')
        .where('user_id', user_id)
    },
    getUserBooksById(knex, id){
        return knex.from('wellread_users_books')
        .select(['wellread_users_books.*', 'wellread_books.title', 'wellread_books.author', 'wellread_books.isbn', 'wellread_books.cover_i', 'wellread_books.oclc'])
        .join('wellread_books', 'wellread_books.id', '=', 'wellread_users_books.book_id')
        .andWhere('wellread_users_books.id', id)
    },
    getUserBooksByStatus(knex, user_id, book_status){
        return knex.select('*').from('wellread_users_books').where('user_id', user_id).where('book_status', book_status)
    },
    updateUserBook(knex, newUserBookFields, id){
        return knex('wellread_users_books')
          .where({ id })
          .update(newUserBookFields)
    },
    deleteUserBook(knex, id){
        return knex('wellread_users_books')
          .where({ id })
          .delete()
    },
    insertUserBook(knex, newUserBook){
        return knex
            .insert(newUserBook)
            .into('wellread_users_books')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = userBooksService;