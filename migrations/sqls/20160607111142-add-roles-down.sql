ALTER TABLE roles DROP CONSTRAINT unique_roles;
DELETE FROM roles WHERE NAME='author';
DELETE FROM roles WHERE name='reviewer';
DELETE FROM roles WHERE NAME='admin';
DELETE FROM roles WHERE name='user';