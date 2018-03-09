-- Up
CREATE TABLE users (
	id	INTEGER PRIMARY KEY,
  device_user_id	TEXT,
  mobile	TEXT,
  opt_in	NUMERIC DEFAULT 1
);
-- Down
DROP TABLE users;