import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";
import {replace, render} from "../utils/render.js";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._cardElement = null;
    this._cardEditElement = null;
  }

  render(card) {

    const oldCardElement = this._cardElement;
    const oldCardEditElement = this._cardEditElement;

    this._cardElement = new TripDayEventComponent(card);
    this._cardEditElement = new TripEventComponent(card);

    const escKeyDownHandler = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replace(this._cardElement, this._cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    render(this._container, this._cardElement);

    this._cardElement
      .setClickHandler(() => {
        replace(this._cardEditElement, this._cardElement);
        document.addEventListener(`keydown`, escKeyDownHandler);
      });

    this._cardEditElement
      .setSubmitHandler((evt) => {
        evt.preventDefault();
        replace(this._cardElement, this._cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      });

    this._cardEditElement.setFavoriteButtonClickHandler(() => {
      const newCard = Object.assign({}, card, {isFavorite: !card.isFavorite});
      this._onDataChange(card, newCard, this);
    });

    if (oldCardEditElement && oldCardElement) {
      replace(this._cardElement, oldCardElement);
      replace(this._cardEditElement, oldCardEditElement);
    } else {
      render(this._container, this._cardElement);
    }
  }
}
