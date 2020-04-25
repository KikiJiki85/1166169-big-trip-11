import TripInfoComponent from "../components/trip-info.js";
import TripSortComponent from "../components/trip-sort.js";
import TripDaysContainerComponent from "../components/trip-days-container.js";
import TripDayComponent from "../components/trip-day.js";
import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
import {replace, render, RenderPosition} from "../utils/render.js";

export default class TripController {
  constructor(container) {
    this._container = container;
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();

  }

  render(cards) {
    const dates = [
      ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
    ];

    render(
        tripInfoElement,
        new TripInfoComponent(cards),
        RenderPosition.AFTERBEGIN
    );

    render(
        tripEventsElement,
        this._tripSortComponent,
        RenderPosition.AFTERBEGIN
    );

    render(
        tripEventsElement,
        this._tripSortComponent
    );

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
      render(this._container, day);
    });

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
    document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
  }
}
