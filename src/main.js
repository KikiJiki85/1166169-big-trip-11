import FilterMenuComponent from "./components/filter-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripDayEventComponent from "./components/trip-day-event.js";
import TripDayComponent from "./components/trip-day.js";
import TripDaysContainerComponent from "./components/trip-days-container.js";
import TripEventComponent from "./components/trip-event.js";
import TripInfoComponent from "./components/trip-info.js";
import TripMenuComponent from "./components/trip-menu.js";
import TripSortComponent from "./components/trip-sort.js";
import {renderElement, RenderPosition} from "./utils.js";
import {filters} from "./mock/filter.js";
import {menuItems} from "./mock/menu.js";
import {cards} from "./mock/card.js";

const dates = [
  ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
];

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);


renderElement(
    tripMainElement,
    new TripInfoComponent(cards).getElement(),
    RenderPosition.AFTERBEGIN
);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

renderElement(
    tripInfoElement,
    new TripCostComponent().getElement(),
    RenderPosition.BEFOEND
);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

renderElement(
    tripControlsElement,
    new TripMenuComponent(menuItems).getElement(),
    RenderPosition.AFTERBEGIN
);

renderElement(
    tripControlsElement,
    new FilterMenuComponent(filters).getElement(),
    RenderPosition.BEFOEND
);

renderElement(
    tripEventsElement,
    new TripSortComponent().getElement(),
    RenderPosition.AFTERBEGIN
);

renderElement(
    tripEventsElement,
    new TripDaysContainerComponent().getElement(),
    RenderPosition.BEFOEND
);

const tripDaysContainer = tripEventsElement.querySelector(`.trip-days`);

dates.forEach((date, dateIndex) => {
  const day = new TripDayComponent(
      new Date(date),
      dateIndex + 1
  ).getElement();
  cards
    .filter((_card) => new Date(_card.startDate).toDateString() === date)
    .forEach((_card) => {
      const eventsList = day.querySelector(`.trip-events__list`);
      const tripDayEventComponent = new TripDayEventComponent(_card);
      const cardElement = tripDayEventComponent.getElement();
      const tripEventComponent = new TripEventComponent(_card);
      const cardEditElement = tripEventComponent.getElement();
      renderElement(eventsList, cardElement, RenderPosition.BEFOEND);

      cardElement
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          eventsList.replaceChild(cardEditElement, cardElement);
        });

      cardEditElement.addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        eventsList.replaceChild(cardElement, cardEditElement);
      });

    });
  renderElement(tripDaysContainer, day, RenderPosition.BEFOEND);
});

const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
