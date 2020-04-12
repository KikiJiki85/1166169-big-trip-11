import {createFilterMenuTemplate} from "./components/filter-menu.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createTripDayEventTemplate} from "./components/trip-day-event";
import {createTripDayTemplate} from "./components/trip-day.js";
import {createTripDaysContainerTemplate} from "./components/trip-days-container.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripMenuTemplate} from "./components/trip-menu.js";
import {createTripSortTemplate} from "./components/trip-sort.js";
import {render, createElement} from "./utils.js";
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


render(tripMainElement, createTripInfoTemplate(cards), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripCostTemplate(), `beforeend`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(tripControlsElement, createTripMenuTemplate(menuItems), `afterbegin`);
render(tripControlsElement, createFilterMenuTemplate(filters), `beforeend`);
render(tripEventsElement, createTripSortTemplate(), `afterbegin`);

render(tripEventsElement, createTripDaysContainerTemplate(), `beforeend`);

const tripDaysContainer = tripEventsElement.querySelector(`.trip-days`);


dates.forEach((date, dateIndex) => {
  const day = createElement(createTripDayTemplate(new Date(date), dateIndex + 1));
  cards
    .filter((_card) => new Date(_card.startDate).toDateString() === date)
    .forEach((_card, cardIndex) => {
      render(day.querySelector(`.trip-events__list`), cardIndex === 0 && dateIndex === 0 ? createTripEventTemplate(_card) : createTripDayEventTemplate(_card), `beforeend`);
    });

  render(tripDaysContainer, day.parentElement.innerHTML, `beforeend`);
});

const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;

//
