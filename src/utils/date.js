const moment = require(`moment`);

// TODO: правильно ли подключил? Или как правильно указывать добавлыенные плагины и зависимости.
const momentDurationFormatSetup = require(`moment-duration-format`);
momentDurationFormatSetup(moment);

export const getRuntimeFormat = (minutes) => {
  return moment.duration(minutes, `minutes`).format(`h[h] m[m]`);
};

export const getReleaseYearFormat = (minutes) => {
  return moment(minutes).format(`YYYY`);
};

export const getReleaseDateFormat = (minutes) => {
  return moment(minutes).format(`D MMM YYYY`);
};

export const getCommentTime = (minutes) => {
  return moment(minutes).fromNow();
};
