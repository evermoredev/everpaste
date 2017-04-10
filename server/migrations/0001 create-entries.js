/**
 * Create the entries table
 */

export const name = `Entries Table`;

export const up = `
  CREATE TABLE entries
  (id serial primary key,
   key varchar(255) not null,
   text text not null,
   privacy text not null,
   name varchar(255),
   title varchar(255),
   filename varchar(255),
   expiration timestamp,
   created timestamp default clock_timestamp(),
   unique(key));
`;

export const down = `DROP TABLE entries;`;
