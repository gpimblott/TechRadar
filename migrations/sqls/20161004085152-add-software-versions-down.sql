ALTER TABLE comments DROP COLUMN software_version_id;
ALTER TABLE technology_project_link DROP COLUMN software_version_id;
ALTER TABLE technology_project_link DROP COLUMN id;
DROP TABLE software_versions;