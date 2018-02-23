-- Up
CREATE TABLE vehicles (
  id	INTEGER	PRIMARY	KEY,
  user_id	INTEGER,
  device_vehicle_id	TEXT
);
-- Down
DROP TABLE vehicles;