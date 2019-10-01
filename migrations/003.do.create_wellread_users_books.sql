CREATE TABLE wellread_users_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER
        REFERENCES wellread_users(id) ON DELETE CASCADE NOT NULL,
    book_id INTEGER
        REFERENCES wellread_books(id) ON DELETE CASCADE NOT NULL,
    book_status INTEGER DEFAULT 1,
    rating INTEGER DEFAULT NULL,
    notes TEXT DEFAULT NULL
);

/*  
book_status 
    1 - to read
    2 - currently reading 
    3 - finished
*/