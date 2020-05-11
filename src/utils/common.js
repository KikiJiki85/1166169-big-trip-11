import moment from "moment";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const parseTime = (UTCTimestamp) => moment(UTCTimestamp).format(`HH:mm`);

export const getTripDuration = (startDate, endDate) => {
  const monthName = moment(startDate).format(`MMM`);
  const startDay = moment(startDate).format(`DD`);
  const endDay = moment(endDate).format(`DD`);

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};

export const getEventDuration = (startDate, endDate) => {
  const duration = moment
    .duration()
    .subtract(startDate - endDate);

  const days = duration.days();
  const hours = duration.hours();
  const minuntes = duration.minutes();

  return `
    ${(days + `D`) || ``}
    ${(hours + `H`) || ``}
    ${minuntes}M
  `;
};
