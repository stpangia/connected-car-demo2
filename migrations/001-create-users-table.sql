-- Up
CREATE TABLE users (
	id	INTEGER PRIMARY KEY,
  device_user_id	TEXT,
  mobile	TEXT,
  opt_in	NUMERIC
);
-- Down
DROP TABLE users;