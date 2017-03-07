CREATE TABLE entries
(id serial primary key,
 key varchar(255) not null,
 text text not null,
 privacyOption text not null,
 name varchar(255),
 title varchar(255),
 expiration timestamp,
 created timestamp default clock_timestamp(),
 unique(key));