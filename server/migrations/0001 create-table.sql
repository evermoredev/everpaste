CREATE TABLE entries
(id serial primary key,
 key varchar(255) not null,
 text text not null,
 public bool not null,
 name varchar(255),
 title varchar(255),
 expiration int,
 unique(key));