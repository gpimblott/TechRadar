ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_technology_userid_key;
ALTER TABLE votes ADD UNIQUE(technology,status,userid);

