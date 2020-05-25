import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";
import {replace, render, remove, RenderPosition} from "../utils/render.js";
import {Mode, SHAKE_ANIMATION_TIMEOUT} from "../utils/common.js";
import moment from "moment";
import PointModel from "../models/point.js";
import Store from "../store.js";

export const EmptyPoint = {
  type: `taxi`,
  city: ``,
  startDate: Date.now(),
  endDate: Date.now(),
  offers: [],
  photos: [],
  description: ``,
  price: 0,
  isFavorite: false,
  id: String(Date.now() + Math.random()),
  isNew: true
};

const parseFormData = (formData) => {
  const offerLabels = [
    ...document.querySelectorAll(`label[for^="event-offer"]`)
  ];
  const destination = Store.getDestinations().find(
      (city) => city.name === formData.get(`event-destination`)
  );

  return new PointModel({
    base_price: formData.get(`event-price`),
    date_from: new Date(
        moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf()
    ).toISOString(),
    date_to: new Date(
        moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf()
    ).toISOString(),
    destination: {
      description: destination.description,
      name: destination.name,
      pictures: destination.pictures
    },
    is_favorite: formData.get(`event-favorite`) === `on` ? true : false,
    offers: offerLabels.map((offer) => ({
      title: offer.querySelector(`.event__offer-title`).textContent,
      price: Number(offer.querySelector(`.event__offer-price`).textContent)
    })),
    type: formData.get(`event-type`)
  });
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

    this._cardEditComponent.setClickHandler(() => {
      this._replaceCardEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });


    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._cardEditComponent.setData({
        saveButtonText: `Saving...`
      });

      const formData = this._cardEditComponent.getData();
      const data = parseFormData(formData);

      this._onDataChange(card, data, this);
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() => {
      this._cardEditComponent.setData({
        deleteButtonText: `Deleting...`
      });
      this._onDataChange(card, null, this);
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    });

    this._cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = PointModel.clone(card);
      newCard.isFavorite = !newCard.isFavorite;

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
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
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

  shake() {
    this._cardEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT /
      1000}s`;
    this._cardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT /
      1000}s`;

    setTimeout(() => {
      this._cardEditComponent.getElement().style.animation = ``;
      this._cardComponent.getElement().style.animation = ``;

      this._cardEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      });
    }, SHAKE_ANIMATION_TIMEOUT);
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
