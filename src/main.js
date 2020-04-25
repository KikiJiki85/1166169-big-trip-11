import FilterMenuComponent from "./components/filter-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripDayEventComponent from "./components/trip-day-event.js";
import TripDayComponent from "./components/trip-day.js";
import TripDaysContainerComponent from "./components/trip-days-container.js";
import TripEventComponent from "./components/trip-event.js";
import TripInfoComponent from "./components/trip-info.js";
import TripMenuComponent from "./components/trip-menu.js";
import TripSortComponent from "./components/trip-sort.js";
import NoPointsComponent from "./components/no-points.js";
import {replace, render, RenderPosition} from "./utils/render.js";
import {filters} from "./mock/filter.js";
import {menuItems} from "./mock/menu.js";
import {cards} from "./mock/card.js";

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(
    tripControlsElement,
    new TripMenuComponent(menuItems),
    RenderPosition.AFTERBEGIN
);

render(
    tripControlsElement,
    new FilterMenuComponent(filters)
);

render(
    tripInfoElement,
    new TripCostComponent()
);

if (cards.length === 0) {
  render(
      tripEventsElement,
      new NoPointsComponent()
  );
} else {

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
      new TripSortComponent(),
      RenderPosition.AFTERBEGIN
  );

  render(
      tripEventsElement,
      new TripDaysContainerComponent()
  );

  const tripDaysContainer = tripEventsElement.querySelector(`.trip-days`);

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
    render(tripDaysContainer, day);
  });

  const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
  document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
}
