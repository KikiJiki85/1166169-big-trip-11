import AbstractComponent from "./abstract-component.js";
import {getTripDuration} from "../utils/common.js";

const createTripInfoTemplate = (cards) => {
  return (`<div class="trip-info__main">
      <h1 class="trip-info__title">${cards[0].city}
       ${cards.length > 2 ? `&mdash; ... &mdash;` : `&mdash; ${cards[1].city} &mdash;`}
       ${cards[cards.length - 1].city}</h1>
      <p class="trip-info__dates">
      ${getTripDuration(cards[0].startDate, cards[cards.length - 1].endDate)}
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
