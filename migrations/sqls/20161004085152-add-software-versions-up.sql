CREATE TABLE software_versions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32),
    technology integer references technologies(id) ON DELETE CASCADE,
    release_date TIMESTAMP without time zone
);

ALTER TABLE comments ADD COLUMN 
    software_version_id INTEGER 
    REFERENCES software_versions(id) ON DELETE CASCADE;

ALTER TABLE technology_project_link ADD COLUMN
    software_version_id INTEGER
    REFERENCES software_versions(id) ON DELETE CASCADE;