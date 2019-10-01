CREATE TABLE wellread_books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    cover_i TEXT,
    isbn TEXT,
    oclc TEXT
);