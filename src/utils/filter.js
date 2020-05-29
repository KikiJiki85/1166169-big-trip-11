import {FilterType} from "./common.js";

const getFuturePoints = (points) => {
  return points
    .filter((point) => point.endDate > Date.now())
    .sort((a, b) => a.startDate - b.startDate);
};

const getPastPoints = (points) => {
  return points
    .filter((point) => point.endDate < Date.now())
    .sort((a, b) => a.startDate - b.startDate);
};

const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points.sort((a, b) => a.startDate - b.startDate);
    case FilterType.FUTURE:
      return getFuturePoints(points);
    case FilterType.PAST:
      return getPastPoints(points);
  }

  return points;
};

export {
  getFuturePoints,
  getPastPoints,
  getPointsByFilter
};

