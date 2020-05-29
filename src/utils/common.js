import moment from "moment";

const SHAKE_ANIMATION_TIMEOUT = 700;
const SHAKE = `shake`;
const MAX_SHOWED_OFFERS_AMOUNT = 3;

const AUTHORIZATION = `Basic aEd666estfeqe5Ehj`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const Button = {
  SAVE: `Save`,
  DELETE: `Delete`,
  SAVING: `Saving...`,
  DELETING: `Deleting...`
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`
};

const Key = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const EventTypeToPlaceholderText = {
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

const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

const menuItems = [
  {
    name: MenuItem.TABLE,
    active: true
  },
  {
    name: MenuItem.STATS,
    active: false
  }
];

const addZero = (value) => (value < 10 ? `0${value}` : value);

const parseTime = (UTCTimestamp) => moment(UTCTimestamp).format(`HH:mm`);

const getTripDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startMonthName = moment(startDateUTCTimestamp).format(`MMM`);
  const endMonthName = moment(endDateUTCTimestamp).format(`MMM`);
  const startDay = moment(startDateUTCTimestamp).format(`DD`);
  const endDay = moment(endDateUTCTimestamp).format(`DD`);

  return `${startMonthName} ${startDay}&nbsp;&mdash;&nbsp;${
    startMonthName !== endMonthName ? `${endMonthName} ` : ``
  }${endDay}`;
};

const getEventDuration = (
    startDateUTCTimestamp,
    endDateUTCTimestamp
) => {
  const duration = moment
    .duration()
    .subtract(startDateUTCTimestamp - endDateUTCTimestamp);

  const days = duration.days();
  const hours = duration.hours();
  const minuntes = duration.minutes();

  return `
    ${(days > 0 && `${addZero(days)}D`) || ``}
    ${((days > 0 || hours > 0) && `${addZero(hours)}H`) || ``}
    ${addZero(minuntes)}M
  `;
};

export {
  SHAKE_ANIMATION_TIMEOUT,
  SHAKE,
  MAX_SHOWED_OFFERS_AMOUNT,
  AUTHORIZATION,
  END_POINT,
  Button,
  Method,
  Mode,
  FilterType,
  DefaultData,
  Key,
  EventTypeToPlaceholderText,
  MenuItem,
  menuItems,
  parseTime,
  getTripDuration,
  getEventDuration
};
