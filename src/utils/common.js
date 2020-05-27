import moment from "moment";

export const SHAKE_ANIMATION_TIMEOUT = 700;
export const SHAKE = `shake`;
export const MAX_SHOWED_OFFERS_AMOUNT = 3;

export const Button = {
  SAVE: `Save`,
  DELETE: `Delete`,
  SAVING: `Saving...`,
  DELETING: `Deleting...`
};

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

export const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`
};

export const Key = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

export const EventTypeToPlaceholderText = {
  "taxi": `to`,
  "bus": `to`,
  "train": `to`,
  "ship": `to`,
  "transport": `to`,
  "drive": `to`,
  "flight": `to`,
  "check-in": `at`,
  "sightseeing": `at`,
  "restaurant": `at`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const menuItems = [
  {
    name: MenuItem.TABLE,
    active: true
  },
  {
    name: MenuItem.STATS,
    active: false
  }
];

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
