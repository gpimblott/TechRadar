CREATE TABLE roles(
                id SERIAL PRIMARY KEY, name VARCHAR(15) not null, admin boolean default false);

CREATE TABLE users(
                id SERIAL PRIMARY KEY, username VARCHAR(15) not null,
                password VARCHAR(100) not null, displayName VARCHAR(40),
                role integer references roles(id),
                avatar VARCHAR(200));

CREATE TABLE categories(
                id SERIAL PRIMARY KEY, name VARCHAR(40) not null, description TEXT);

CREATE TABLE status(id SERIAL PRIMARY KEY, name VARCHAR(10));

CREATE TABLE technologies(id SERIAL PRIMARY KEY,
                name VARCHAR(40) not null, website VARCHAR(100), description TEXT,
                category integer references categories(id),
                date TIMESTAMP without time zone default (now() at time zone 'utc'));


CREATE TABLE projects(id SERIAL PRIMARY KEY, name VARCHAR(100),
                description TEXT);

CREATE TABLE comments(
            id SERIAL PRIMARY KEY,
            technology integer references technologies(id) ON DELETE CASCADE,
            userid integer references users(id) ON DELETE CASCADE,
            text TEXT, date TIMESTAMP without time zone default (now() at time zone 'utc'));

CREATE TABLE votes(
            id SERIAL PRIMARY KEY,
            technology integer references technologies(id) ON DELETE CASCADE,
            status INTEGER references status(id) ON DELETE CASCADE,
            userid INTEGER references users(id) ON DELETE CASCADE,
            UNIQUE(technology, status, userid),
            date TIMESTAMP without time zone default (now() at time zone 'utc'));

CREATE TABLE tech_status_link(
            id SERIAL PRIMARY KEY,
            reason TEXT,
            statusid INTEGER references status(id) ON DELETE CASCADE,
            userid INTEGER references users(id) ON DELETE CASCADE,
            technologyid INTEGER references technologies(id) ON DELETE CASCADE,
            date TIMESTAMP without time zone default (now() at time zone 'utc'));

CREATE TABLE stacks(
            id SERIAL PRIMARY KEY, name VARCHAR(40) not null, description TEXT);

CREATE TABLE technology_stack_link(
            stack INTEGER references stacks(id) ON DELETE CASCADE,
            technology INTEGER references technologies(id) ON DELETE CASCADE);

CREATE TABLE technology_project_link(
            projectid INTEGER references projects(id) ON DELETE CASCADE,
            technologyid INTEGER references technologies(id) ON DELETE CASCADE);

ALTER SEQUENCE categories_id_seq RESTART WITH 1;

