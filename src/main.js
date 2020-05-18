import TripMenuComponent from "./components/trip-menu.js";
import NoPointsComponent from "./components/no-points.js";
import TripCostComponent from "./components/trip-cost.js";
import TripInfoComponent from "./components/trip-info.js";
import StatisticsComponent from "./components/statistics.js";

import TripController from "./controllers/trip.js";
import FilterController from "./controllers/filter.js";

import {render, RenderPosition} from "./utils/render.js";
import {menuItems, MenuItem} from "./mock/menu.js";
import {cards} from "./mock/card.js";

import PointsModel from "./models/point.js";
import TripDaysContainer from "./components/trip-days-container.js";

const tripEventsElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripDaysComponent = new TripDaysContainer();

const siteMainElement = document.querySelector(`.page-body__page-main`);
const menuComponent = new TripMenuComponent(menuItems);

const pointsModel = new PointsModel();
pointsModel.setPoints(cards);
const tripController = new TripController(tripDaysComponent, pointsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);

render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

render(
    tripInfoElement,
    new TripCostComponent()
);

render(
    tripEventsElement,
    tripDaysComponent
);

if (cards.length === 0) {

  render(
      tripEventsElement,
      new NoPointsComponent()
  );

} else {

  render(
      tripInfoElement,
      new TripInfoComponent(cards),
      RenderPosition.AFTERBEGIN
  );

  tripController.render(cards);

  document
    .querySelector(`.trip-main__event-add-btn`)
    .addEventListener(`click`, () => {
      tripController.createPoint();
    });

}

render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

menuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      tripController.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});
