import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysContainerComponent from "../components/trip-days-container.js";
import TripDayComponent from "../components/trip-day.js";
import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";
import {replace, render, RenderPosition} from "../utils/render.js";

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

const renderDaysAndEvents = (cards, container, isDefaultSorting = true) => {
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
        const cardElement = new TripDayEventComponent(_card);
        const cardEditElement = new TripEventComponent(_card);

        const eventsList = day.getElement().querySelector(`.trip-events__list`);

        const escKeyDownHandler = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

          if (isEscKey) {
            replace(cardElement, cardEditElement);
            document.removeEventListener(`keydown`, escKeyDownHandler);
          }
        };

        render(eventsList, cardElement);

        cardElement
          .setClickHandler(() => {
            replace(cardEditElement, cardElement);
            document.addEventListener(`keydown`, escKeyDownHandler);
          });

        cardEditElement
          .setSubmitHandler((evt) => {
            evt.preventDefault();
            replace(cardElement, cardEditElement);
            document.removeEventListener(`keydown`, escKeyDownHandler);
          });

      });
    render(container, day);
  });
};


export default class TripController {
  constructor(container) {
    this._container = container;
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
  }

  render(cards) {

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

    renderDaysAndEvents(cards, tripDaysElement);

    this._tripSortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = getSortedTripCards(cards, sortType);
      tripDaysElement.innerHTML = ``;
      let isDefaultSorting = true;
      if (sortType === SortType.TIME || sortType === SortType.PRICE) {
        isDefaultSorting = false;
      }
      renderDaysAndEvents(sortedCards, tripDaysElement, isDefaultSorting);
    });

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);
    document.querySelector(`.trip-info__cost-value`).innerHTML = getFullPrice;
  }
}