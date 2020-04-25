import FilterMenuComponent from "./components/filter-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripMenuComponent from "./components/trip-menu.js";
import NoPointsComponent from "./components/no-points.js";
import TripControllerComponent from "./controllers/trip-controller.js";
import {render, RenderPosition} from "./utils/render.js";
import {filters} from "./mock/filter.js";
import {menuItems} from "./mock/menu.js";
import {cards} from "./mock/card.js";


const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);


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
  const tripController = new TripControllerComponent(tripEventsElement);
  tripController.render(cards);
}
