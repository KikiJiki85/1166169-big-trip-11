import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysContainerComponent from "../components/trip-days-container.js";
import TripDayComponent from "../components/trip-day.js";
import NoPointsComponent from "../components/no-points.js";
import TripInfoComponent from "../components/trip-info.js";

import {render, remove, RenderPosition} from "../utils/render.js";
import PointController, {EmptyPoint} from "../controllers/point.js";
import {Mode, FilterType} from "../utils/common.js";
import TripFilterComponent from "../components/filter-menu.js";
const tripEventsElement = document.querySelector(`.trip-events`);
const tripInfoElement = document.querySelector(`.trip-main__trip-info`);

const getSortedTripCards = (pointsModel, sortType) => {
  let sortedTripCards = [];
  const showingTripCards = pointsModel.getPoints().slice();

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
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._tripSortComponent = null;
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
    this._filterMenuComponent = new TripFilterComponent();
    this._showedPointControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._creatingPoint = null;
    this._noPointsComponent = null;
    this._tripInfoComponent = null;
    this._isDefaultSorting = true;
    this._api = api;
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    this._pointsModel.setFilter(FilterType.EVERYTHING);

    this._removePoints();
    this._showedPointControllers = renderEvents(
        getSortedTripCards(this._pointsModel, SortType.EVENT),
        this._container,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting = true);

    this._filterMenuComponent.setDefaulFilterType();
    this._tripSortComponent.setDefaulSortType();


    this._creatingPoint = new PointController(
        this._container.getElement(),
        this._onDataChange,
        this._onViewChange
    );

    this._creatingPoint.render(EmptyPoint, Mode.ADDING);
    this._onViewChange();
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  _updatePoints() {
    this._removePoints();

    this._showedPointControllers = renderEvents(
        this._pointsModel.getPoints(),
        this._container,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );
  }

  _toggleNoEventsMessageComponent() {
    if (this._pointsModel.getPoints().length === 0) {
      if (!this._noEventsMessageComponent) {
        this._noEventsMessageComponent = new NoPointsComponent();
        render(
            tripEventsElement,
            this._noEventsMessageComponent
        );
      }
    } else {
      if (this._noEventsMessageComponent) {
        remove(this._noEventsMessageComponent);
        this._noEventsMessageComponent = null;
        this.render();
      }
    }
    this._reset();
  }

  _reset() {
    this._container.getElement().innerHTML = ``;

    if (this._tripInfoComponent) {
      remove(this._tripInfoComponent);
    }
    if (this._tripSortComponent) {
      remove(this._tripSortComponent);
    }

    if (this._pointsModel.getPoints().length) {
      this._tripSortComponent = new TripSortComponent();
      this._tripInfoComponent = new TripInfoComponent(
          this._pointsModel.getPoints()
      );

      this.render();
    }
    this._getFullPrice();
  }

  render() {

    if (this._pointsModel.getPoints().length === 0) {
      this._toggleNoEventsMessageComponent();
      return;
    }

    this._showedPointControllers = renderEvents(
        this._pointsModel.getPoints(),
        this._container,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );

    this._tripSortComponent = new TripSortComponent();
    this._tripInfoComponent = new TripInfoComponent(this._pointsModel.getPoints());
    render(tripInfoElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(tripEventsElement, this._tripSortComponent, RenderPosition.AFTERBEGIN);

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

    this._getFullPrice();
  }

  _getFullPrice() {
    const fullPrice = this._pointsModel.getPoints().reduce((acc, item) => {
      return (
        acc +
        Number(item.price) +
        item.offers.reduce((_acc, _item) => _acc + Number(_item.price), 0)
      );
    }, 0);
    document.querySelector(`.trip-info__cost-value`).innerHTML = fullPrice;
  }

  _onDataChange(oldCard, newCard, pointController, itShouldRerender = true) {
    if (oldCard === EmptyPoint) {
      this._creatingPoint = null;
      if (newCard === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api
          .createPoint(newCard)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);

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
            this._toggleNoEventsMessageComponent();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newCard === null) {
      this._api
        .deletePoint(oldCard.id)
        .then(() => {
          this._pointsModel.removePoint(oldCard.id);
          this._updatePoints();
          this._toggleNoEventsMessageComponent();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api
        .updatePoint(oldCard.id, newCard)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(
              oldCard.id,
              pointModel
          );
          if (isSuccess) {
            if (itShouldRerender) {
              pointController.render(pointModel, Mode.DEFAULT);
              this._updatePoints();
              this._reset();
              this._filterController.render();
            } else {
              pointController.render(pointModel, Mode.EDIT);
            }
          }
        })
        .catch(() => {
          pointController.shake();
        });
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

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }
}
