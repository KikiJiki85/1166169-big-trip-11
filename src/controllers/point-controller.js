import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";
import {replace, render} from "../utils/render.js";
import {Mode} from "../utils/common.js";

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = Mode.DEFAULT;
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;

    this._cardComponent = new TripDayEventComponent(card);
    this._cardEditComponent = new TripEventComponent(card);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        this._replaceCardEditToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._cardComponent.setClickHandler(() => {
      this._replaceCardToCardEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceCardEditToCard();
    });

    this._cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = Object.assign({}, card, {isFavorite: !card.isFavorite});

      this._onDataChange(card, newCard, this);
    });

    if (oldCardComponent && oldCardEditComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardEditComponent, oldCardEditComponent);
    } else {
      render(
          this._container,
          this._cardComponent
      );
    }
  }

  _replaceCardEditToCard() {
    replace(this._cardComponent, this._cardEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToCardEdit() {
    this._onViewChange();
    replace(this._cardEditComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceCardEditToCard();
    }
  }
}
