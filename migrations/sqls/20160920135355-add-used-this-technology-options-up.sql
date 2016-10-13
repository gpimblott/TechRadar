CREATE TABLE used_this_technology_options(
            id SERIAL PRIMARY KEY,
            daysAgo INTEGER,
            name VARCHAR(32)
);
INSERT INTO used_this_technology_options VALUES(DEFAULT, 0, 'Today');
INSERT INTO used_this_technology_options VALUES(DEFAULT, 7, 'A week ago');
INSERT INTO used_this_technology_options VALUES(DEFAULT, 30, 'A month ago');
INSERT INTO used_this_technology_options VALUES(DEFAULT, 91, 'Three months ago');
INSERT INTO used_this_technology_options VALUES(DEFAULT, 182, 'Half a year ago');
INSERT INTO used_this_technology_options VALUES(DEFAULT, 365, 'A year ago or more');