import FilterMenuComponent from "./components/filter-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripMenuComponent from "./components/trip-menu.js";
import TripInfoComponent from "./components/trip-info.js";
import NoPointsComponent from "./components/no-points.js";
import TripControllerComponent from "./controllers/trip-controller.js";
import {render, RenderPosition} from "./utils/render.js";
import {filters} from "./mock/filter.js";
import {menuItems} from "./mock/menu.js";
import {cards} from "./mock/card.js";

const tripEventsElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

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

  render(
      tripInfoElement,
      new TripInfoComponent(cards),
      RenderPosition.AFTERBEGIN
  );

  const tripController = new TripControllerComponent(tripEventsElement);
  tripController.render(cards);

}
