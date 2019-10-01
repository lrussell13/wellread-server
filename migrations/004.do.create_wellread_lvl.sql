CREATE TABLE wellread_lvl (
    id SERIAL PRIMARY KEY,
    user_id INTEGER
        REFERENCES wellread_users(id) ON DELETE CASCADE NOT NULL,
    lvl INTEGER NOT NULL DEFAULT 0
);