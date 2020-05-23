import moment from "moment";

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const AUTHORIZATION = `Basic aEd666estfeqe5Ehj`;
export const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

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
