import TripMenuComponent from "./components/trip-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import StatisticsComponent from "./components/statistics.js";
import TripDaysContainer from "./components/trip-days-container.js";
import TripController from "./controllers/trip.js";
import FilterController from "./controllers/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {AUTHORIZATION, END_POINT, MenuItem, menuItems} from "./utils/common.js";
import PointsModel from "./models/points.js";
import API from "./api.js";

const tripEventsElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripDaysComponent = new TripDaysContainer();
const siteMainElement = document.querySelector(`.page-body__page-main`);
const menuComponent = new TripMenuComponent(menuItems);
const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const tripController = new TripController(tripDaysComponent, pointsModel, api);
const statisticsComponent = new StatisticsComponent(pointsModel);
const filterController = new FilterController(tripControlsElement, pointsModel);

api.getData()
  .then((points) => {
    pointsModel.setPoints(points);
    filterController.render();
    tripController.render();
  });

render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
render(tripInfoElement, new TripCostComponent());
render(tripEventsElement, tripDaysComponent);


document
  .querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    tripController.createPoint();
  });

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
