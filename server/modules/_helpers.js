import moment from 'moment';

/**
 * Adds or subtracts an amount of time from now and produces a postgres
 * timestamp.
 * @param  {number} addTime - amount of time to add to now
 * @param  {number} subtractTime - amount of time to subtract from now
 * @returns {string} String in a postgres timestamp format
 */
export const postgresTimestamp = (addTime, subtractTime) => {
  let timestamp = moment();
  if (addTime) {
    addTime = addTime.split(' ');
    timestamp = timestamp.add(addTime[0], addTime[1]);
  }
  if (subtractTime) {
    subtractTime = subtractTime.split(' ');
    timestamp = timestamp.add(subtractTime[0], subtractTime[1]);
  }
  return moment.utc(timestamp).format('YYYY-MM-DD H:mm:ss.SSS Z');
};
