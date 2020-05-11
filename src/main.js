import TripCostComponent from "./components/trip-cost.js";
import TripMenuComponent from "./components/trip-menu.js";
import TripInfoComponent from "./components/trip-info.js";
import NoPointsComponent from "./components/no-points.js";
import TripControllerComponent from "./controllers/trip.js";
import FilterController from "./controllers/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {menuItems} from "./mock/menu.js";
import {cards} from "./mock/card.js";
import PointsModel from "./models/point.js";

const tripEventsElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

const pointsModel = new PointsModel();
pointsModel.setPoints(cards);

render(
    tripControlsElement,
    new TripMenuComponent(menuItems),
    RenderPosition.AFTERBEGIN
);

// render(
//     tripControlsElement,
//     new FilterMenuComponent(filters)
// );

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

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

  render(
      tripInfoElement,
      new TripInfoComponent(cards),
      RenderPosition.AFTERBEGIN
  );

  const tripController = new TripControllerComponent(tripEventsElement, pointsModel);
  tripController.render(cards);

}
