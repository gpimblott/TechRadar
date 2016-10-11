CREATE TABLE software_versions (
    id SERIAL PRIMARY KEY,
    technology integer references technologies(id) ON DELETE CASCADE,
    name VARCHAR(32)
);

ALTER TABLE software_versions 
    ADD UNIQUE (technology, name);

ALTER TABLE comments ADD COLUMN 
    software_version_id INTEGER 
    REFERENCES software_versions(id) ON DELETE CASCADE;

ALTER TABLE technology_project_link ADD COLUMN
    software_version_id INTEGER
    REFERENCES software_versions(id) ON DELETE CASCADE;

-- will automatically assign IDs to pre-existing records in Postgres 9.x
ALTER TABLE technology_project_link ADD COLUMN
    id SERIAL PRIMARY KEY;

ALTER TABLE technology_project_link 
    ADD UNIQUE (technologyid, projectid, software_version_id);