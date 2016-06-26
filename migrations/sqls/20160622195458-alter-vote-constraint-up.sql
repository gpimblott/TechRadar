ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_technology_status_userid_key;
ALTER TABLE votes ADD UNIQUE(technology,userid);