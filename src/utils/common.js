const addZero = (value) => {
  if (value === 0) {
    return `00`;
  } else if (value < 10) {
    return `0${value}`;
  }

  return value;
};

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export const parseTime = (UTCTime) => {
  const date = new Date(UTCTime);
  return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
};

export const parseDate = (UTCTime) => {
  const date = new Date(UTCTime);
  return `${date.getDate()}/${date.getMonth()}/${String(date.getFullYear())
    .slice(2)}`;
};
