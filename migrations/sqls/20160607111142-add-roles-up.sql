ALTER TABLE roles ADD CONSTRAINT unique_roles UNIQUE ( name );

INSERT INTO roles (id, name, admin) VALUES (0,'admin', true );
INSERT INTO roles (id, name, admin) VALUES (1,'user', false );
INSERT INTO roles (id, name, admin) VALUES (2,'author', false );
INSERT INTO roles (id, name, admin) VALUES (3,'reviewer', false );

INSERT INTO users (username , password , displayName , role ) VALUES ('admin' , 'HIv+j4AdeXRcRjHQn/82yCqjf8TM5PyUZoPXsza2MDI=' , 'The Admin', 0);

ALTER SEQUENCE roles_id_seq RESTART WITH 4;