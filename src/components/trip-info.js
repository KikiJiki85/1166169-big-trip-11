import AbstractComponent from "./abstract-component.js";

const getDuration = (startDateUTC, endDateUTC) => {
  const startDate = new Date(startDateUTC);
  const monthName = startDate.toLocaleString(`default`, {month: `short`});
  const startDay = startDate.getDate();
  const endDay = new Date(endDateUTC).getDay();

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};

const createTripInfoTemplate = (cards) => {
  return (`<div class="trip-info__main">
      <h1 class="trip-info__title">${cards[0].city}
       ${cards.length > 2 ? `&mdash; ... &mdash;` : `&mdash; ${cards[1].city} &mdash;`}
       ${cards[cards.length - 1].city}</h1>
      <p class="trip-info__dates">
      ${getDuration(cards[0].startDate, cards[cards.length - 1].endDate)}
      </p>
    </div>`);
};

export default class TripInfo extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createTripInfoTemplate(this._cards);
  }
}
