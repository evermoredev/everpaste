import moment from 'moment';

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
  return timestamp.format('YYYY-MM-DD h:mm:ss');
};
