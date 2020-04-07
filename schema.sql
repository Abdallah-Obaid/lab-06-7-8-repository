DROP TABLE IF EXISTS locations  ;

create table locations (
id serial primary key,
formatted_query VARCHAR(255),
search_query VARCHAR(255),
latitude  VARCHAR(255), 
longitude VARCHAR(255)
);

INSERT INTO locations (formatted_query,search_query,latitude,longitude) VALUES ('sadsad','amman','asdsad','asdasd')