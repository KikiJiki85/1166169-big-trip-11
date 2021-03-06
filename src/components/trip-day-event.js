import {parseTime, getEventDuration, EventTypeToPlaceholderText, MAX_SHOWED_OFFERS_AMOUNT} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createTripDayEventTemplate = (card) => {
  return (`<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42"
      src="img/icons/${card.type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${card.type} ${
      EventTypeToPlaceholderText[card.type]
    } ${card.city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">
        ${parseTime(card.startDate)}
        </time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">
        ${parseTime(card.endDate)}
        </time>
      </p>
      <p class="event__duration">
      ${getEventDuration(card.startDate, card.endDate)}
      </p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${card.price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${card.offers
      .slice(0, MAX_SHOWED_OFFERS_AMOUNT)
      .map((offer) => {
        return `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus; &euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `;
      })
      .join(``)}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>
`);
};

export default class TripDayEvent extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createTripDayEventTemplate(this._card);
  }

  setClickHandler(handler) {
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
