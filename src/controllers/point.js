import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";
import {replace, render, remove, RenderPosition} from "../utils/render.js";
import {Mode} from "../utils/common.js";

export const EmptyPoint = {
  type: ``,
  city: ``,
  startDate: null,
  endDate: null,
  offers: [],
  photos: [],
  description: ``,
  price: 0,
  isFavorite: false,
  id: String(Date.now() + Math.random())
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;
    this._mode = mode;

    this._cardComponent = new TripDayEventComponent(card);
    this._cardEditComponent = new TripEventComponent(card);

    this._cardComponent.setClickHandler(() => {
      this._replaceCardToCardEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._cardEditComponent.getData();
      this._onDataChange(card, data, this);
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() =>
      this._onDataChange(card, null, this)
    );

    this._cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = Object.assign({}, card, {isFavorite: !card.isFavorite});

      this._onDataChange(card, newCard, this);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldCardEditComponent && oldCardComponent) {
          replace(this._cardComponent, oldCardComponent);
          replace(this._cardEditComponent, oldCardEditComponent);
          this._replaceCardEditToCard();
        } else {
          render(
              this._container,
              this._cardComponent
          );
        }
        break;
      case Mode.ADDING:
        if (oldCardEditComponent && oldCardComponent) {
          remove(oldCardComponent);
          remove(oldCardEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(
            this._container,
            this._cardEditComponent,
            RenderPosition.AFTERBEGIN
        );
        break;
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(EmptyPoint, null, this);
      }
      this._replaceCardEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
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

  destroy() {
    remove(this._cardEditComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}