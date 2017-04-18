/**
 * Create the entries table
 */

export const name = `Add Forked Key to Entries Table`;

export const up = `
  ALTER TABLE entries
  ADD COLUMN forked_key varchar(255);
`;

export const down = `
  ALTER TABLE entries
  DROP COLUMN forked_key;
`;
