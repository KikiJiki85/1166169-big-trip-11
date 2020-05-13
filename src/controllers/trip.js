import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysContainerComponent from "../components/trip-days-container.js";
import TripDayComponent from "../components/trip-day.js";
import {render, RenderPosition} from "../utils/render.js";
import PointController, {EmptyPoint} from "../controllers/point.js";
import {Mode} from "../utils/common.js";

const tripEventsElement = document.querySelector(`.trip-events`);

const getSortedTripCards = (pointsModel, sortType) => {
  let sortedTripCards = [];
  const showingTripCards = pointsModel.getPoints();

  switch (sortType) {
    case SortType.EVENT:
      sortedTripCards = showingTripCards.sort((a, b) => a.startDate - b.startDate);
      break;
    case SortType.TIME:
      sortedTripCards = showingTripCards.sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
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
    isDefaultSorting
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
        pointController.render(_card, Mode.DEFAULT);
        pointControllers.push(pointController);
      });

    render(container.getElement(), day);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
    this._showedPointControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._creatingPoint = null;
    this._isDefaultSorting = true;
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const tripDaysElement = this._container.getElement();
    this._creatingPoint = new PointController(
        tripDaysElement,
        this._onDataChange,
        this._onViewChange
    );

    this._creatingPoint.render(EmptyPoint, Mode.ADDING);
    this._onViewChange();
  }

  _updatePoints() {
    this._removePoints();

    renderEvents(
        this._pointsModel.getPoints(),
        this._container,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );
  }

  render() {
    const cards = this._pointsModel.getPoints();

    render(
        tripEventsElement,
        this._tripSortComponent,
        RenderPosition.AFTERBEGIN
    );

    render(
        tripEventsElement,
        this._tripDaysContainerComponent
    );

    this._showedPointControllers = renderEvents(
        cards,
        this._container,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );

    this._tripSortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = getSortedTripCards(this._pointsModel, sortType);
      this._isDefaultSorting = (sortType === SortType.EVENT) ? true : false;
      this._removePoints();
      this._showedPointControllers = renderEvents(
          sortedCards,
          this._container,
          this._onDataChange,
          this._onViewChange,
          this._isDefaultSorting);
    });

    const getFullPrice = cards.reduce((acc, item) => {
      return (
        acc +
        item.price +
        item.offers.reduce((_acc, _item) => _acc + _item.price, 0)
      );
    }, 0);
    document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
  }

  _onDataChange(oldCard, newCard, pointController) {
    if (oldCard === EmptyPoint) {
      this._creatingPoint = null;
      if (newCard === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newCard);

        this._showedPointControllers = [
          pointController,
          ...this._showedPointControllers
        ];

        this._removePoints();

        this._showedPointControllers = renderEvents(
            this._pointsModel.getPoints(),
            this._container,
            this._onDataChange,
            this._onViewChange,
            this._isDefaultSorting
        );
      }
    } else if (newCard === null) {
      this._pointsModel.removePoint(oldCard.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldCard.id, newCard);

      if (isSuccess) {
        pointController.render(newCard, Mode.DEFAULT);
      }
    }
  }
  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _removePoints() {
    this._container.getElement().innerHTML = ``;
    this._showedPointControllers.forEach((pointController) =>
      pointController.destroy()
    );
    this._showedPointControllers = [];
  }
}
