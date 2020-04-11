import {createFilterMenuTemplate} from "./components/filter-menu.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createTripDayEventTemplate} from "./components/trip-day-event";
import {createTripDayTemplate} from "./components/trip-day.js";
import {createTripDaysContainerTemplate} from "./components/trip-days-container.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripMenuTemplate} from "./components/trip-menu.js";
import {createTripSortTemplate} from "./components/trip-sort.js";
import {filters} from "./mock/filter.js";
import {menuItems} from "./mock/menu.js";
import {card} from "./mock/card.js";

const TRIP_EVENTS_COUNT = 3;
const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripCostTemplate(), `beforeend`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(tripControlsElement, createTripMenuTemplate(menuItems), `afterbegin`);
render(tripControlsElement, createFilterMenuTemplate(filters), `beforeend`);
render(tripEventsElement, createTripSortTemplate(), `afterbegin`);

render(tripEventsElement, createTripEventTemplate(card), `beforeend`);

render(tripEventsElement, createTripDaysContainerTemplate(), `beforeend`);

const tripDaysContainer = tripEventsElement.querySelector(`.trip-days`);

render(tripDaysContainer, createTripDayTemplate(), `beforeend`);

const tripDayEventsContainer = tripDaysContainer.querySelector(`.trip-events__list`);

for (let i = 0; i < TRIP_EVENTS_COUNT; i++) {
  render(tripDayEventsContainer, createTripDayEventTemplate(), `beforeend`);
}
