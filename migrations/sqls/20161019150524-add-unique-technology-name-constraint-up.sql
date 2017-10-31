-- Will not work if there are duplicate names in technologies
-- To find duplicate technologies use:
/*
WITH duplicate_names AS 
(select name, count(*) from technologies group by name HAVING count(*) > 1)
SELECT t.id, t.name from technologies t
INNER join duplicate_names dn ON dn.name=t.name;
*/
ALTER TABLE technologies ADD CONSTRAINT technology_name_constr UNIQUE (name);