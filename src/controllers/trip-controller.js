import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysContainerComponent from "../components/trip-days-container.js";
import TripDayComponent from "../components/trip-day.js";
import {render, RenderPosition} from "../utils/render.js";
import PointController from "../controllers/point-controller.js";

const tripEventsElement = document.querySelector(`.trip-events`);

const getSortedTripCards = (cards, sortType) => {
  let sortedTripCards = [];
  const showingTripCards = cards.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedTripCards = showingTripCards;
      break;
    case SortType.TIME:
      sortedTripCards = showingTripCards.sort((a, b) => b.startDate - a.startDate);
      break;
    case SortType.PRICE:
      sortedTripCards = showingTripCards.sort((a, b) => b.price - a.price);
      break;
  }
  return sortedTripCards;
};

const renderEvents = (
    cards,
    container,
    onDataChange,
    onViewChange,
    isDefaultSorting = true
) => {
  const pointControllers = [];
  const dates = isDefaultSorting
    ? [...new Set(cards.map((item) => new Date(item.startDate).toDateString()))]
    : [true];

  dates.forEach((date, dateIndex) => {

    const day = isDefaultSorting
      ? new TripDayComponent(new Date(date), dateIndex + 1)
      : new TripDayComponent();

    cards
      .filter((_card) => {
        return isDefaultSorting
          ? new Date(_card.startDate).toDateString() === date
          : _card;
      })
      .forEach((_card) => {
        const pointController = new PointController(
            day.getElement().querySelector(`.trip-events__list`),
            onDataChange,
            onViewChange
        );
        pointController.render(_card);
        pointControllers.push(pointController);
      });

    render(container, day);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
    this._cards = [];
    this._showedPointControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(cards) {
    if (this._cards.length === 0) {
      this._cards = cards;
    }

    render(
        tripEventsElement,
        this._tripSortComponent,
        RenderPosition.AFTERBEGIN
    );

    render(
        tripEventsElement,
        this._tripDaysContainerComponent
    );

    const tripDaysElement = document.querySelector(`.trip-days`);

    this._showedPointControllers = renderEvents(
        cards,
        tripDaysElement,
        this._onDataChange,
        this._onViewChange
    );

    this._tripSortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = getSortedTripCards(cards, sortType);
      tripDaysElement.innerHTML = ``;

      let isDefaultSorting = (sortType === SortType.EVENT) ? true : false;

      this._showedPointControllers = renderEvents(
          sortedCards,
          tripDaysElement,
          this._onDataChange,
          this._onViewChange,
          isDefaultSorting);
    });

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
    document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
  }

  _onDataChange(oldCard, newCard, pointController) {
    const index = this._cards.findIndex((card) => card === oldCard);
    if (index === -1) {
      return;
    }
    this._cards = [
      ...this._cards.slice(0, index),
      newCard,
      this._cards.slice(index + 1)
    ];
    pointController.render(newCard);
  }
  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }
}
