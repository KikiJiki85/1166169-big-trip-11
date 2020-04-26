import TripSortComponent from "../components/trip-sort.js";
import TripDaysContainerComponent from "../components/trip-days-container.js";
import TripDayComponent from "../components/trip-day.js";
import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";
import {replace, render, RenderPosition} from "../utils/render.js";

const tripEventsElement = document.querySelector(`.trip-events`);

const renderDaysAndEvents = (cards, container) => {
  const dates = [
    ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
  ];

  dates.forEach((date, dateIndex) => {

    const day = new TripDayComponent(
        new Date(date),
        dateIndex + 1
    );

    cards
      .filter((_card) => new Date(_card.startDate).toDateString() === date)
      .forEach((_card) => {
        const cardElement = new TripDayEventComponent(_card);
        const cardEditElement = new TripEventComponent(_card);

        const eventsList = day.getElement().querySelector(`.trip-events__list`);

        const escKeyDownHandler = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

          if (isEscKey) {
            replace(cardElement, cardEditElement);
            document.removeEventListener(`keydown`, escKeyDownHandler);
          }
        };

        render(eventsList, cardElement);

        cardElement
          .setClickHandler(() => {
            replace(cardEditElement, cardElement);
            document.addEventListener(`keydown`, escKeyDownHandler);
          });

        cardEditElement
          .setSubmitHandler((evt) => {
            evt.preventDefault();
            replace(cardElement, cardEditElement);
            document.removeEventListener(`keydown`, escKeyDownHandler);
          });

      });
    render(container, day);
  });
};


export default class TripController {
  constructor(container) {
    this._container = container;
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
  }

  render(cards) {

    render(
        tripEventsElement,
        this._tripDaysContainerComponent
    );

    render(
        tripEventsElement.querySelector(`.trip-days`),
        this._tripSortComponent,
        RenderPosition.AFTERBEGIN
    );

    renderDaysAndEvents(cards, this._container);

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
    document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
  }
}
