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
import {renderElement, RenderPosition} from "./utils.js";
import {filters} from "./mock/filter.js";
import {menuItems} from "./mock/menu.js";
import {cards} from "./mock/card.js";

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

renderElement(
    tripControlsElement,
    new TripMenuComponent(menuItems).getElement(),
    RenderPosition.AFTERBEGIN
);

renderElement(
    tripControlsElement,
    new FilterMenuComponent(filters).getElement()
);

renderElement(
    tripInfoElement,
    new TripCostComponent().getElement()
);

if (cards.length === 0) {
  renderElement(
      tripEventsElement,
      new NoPointsComponent().getElement()
  );
} else {

  const dates = [
    ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
  ];

  renderElement(
      tripInfoElement,
      new TripInfoComponent(cards).getElement(),
      RenderPosition.AFTERBEGIN
  );

  renderElement(
      tripEventsElement,
      new TripSortComponent().getElement(),
      RenderPosition.AFTERBEGIN
  );

  renderElement(
      tripEventsElement,
      new TripDaysContainerComponent().getElement()
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
        const tripDayEventComponent = new TripDayEventComponent(_card);
        const cardElement = tripDayEventComponent.getElement();

        const tripEventComponent = new TripEventComponent(_card);
        const cardEditElement = tripEventComponent.getElement();

        const eventsList = day.getElement().querySelector(`.trip-events__list`);

        const replaceEditToCard = () => {
          eventsList.replaceChild(cardElement, cardEditElement);
        };

        const replaceCardToEdit = () => {
          eventsList.replaceChild(cardEditElement, cardElement);
        };

        const escKeyDownHandler = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

          if (isEscKey) {
            replaceEditToCard();
            document.removeEventListener(`keydown`, escKeyDownHandler);
          }
        };

        renderElement(eventsList, cardElement);

        cardElement
          .querySelector(`.event__rollup-btn`)
          .addEventListener(`click`, () => {
            replaceCardToEdit();
            document.addEventListener(`keydown`, escKeyDownHandler);
          });

        cardEditElement.addEventListener(`submit`, (evt) => {
          evt.preventDefault();
          replaceEditToCard();
          document.removeEventListener(`keydown`, escKeyDownHandler);
        });

      });
    renderElement(tripDaysContainer, day.getElement());
  });

  const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
  document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
}
