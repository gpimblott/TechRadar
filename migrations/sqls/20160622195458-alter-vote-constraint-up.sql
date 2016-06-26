DELETE FROM votes WHERE id NOT IN (
SELECT Max(x.id)
    FROM VOTES x
    JOIN (SELECT p.userid,p.technology, MAX(date) AS max_total FROM VOTES p GROUP BY p.userid, p.technology) y ON
                 y.userid = x.userid and y.technology=x.technology AND y.max_total = x.date
GROUP BY x.userid, x.technology);
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_technology_status_userid_key;
ALTER TABLE votes ADD UNIQUE(technology,userid);