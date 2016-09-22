CREATE TABLE used_this_technology(
            id SERIAL PRIMARY KEY,
            technology integer references technologies(id) ON DELETE CASCADE,
            userid INTEGER references users(id) ON DELETE CASCADE,
            UNIQUE(technology, userid),
            date TIMESTAMP without time zone default (now() at time zone 'utc'));
