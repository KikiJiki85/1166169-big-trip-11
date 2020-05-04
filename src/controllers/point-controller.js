import TripDayEventComponent from "../components/trip-day-event.js";
import TripEventComponent from "../components/trip-event.js";
import {replace, render} from "../utils/render.js";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this.onDataChange = onDataChange;
  }

  render(point) {
    const cardElement = new TripDayEventComponent(point);
    const cardEditElement = new TripEventComponent(point);

    const escKeyDownHandler = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replace(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    render(this._container, cardElement);

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

    cardEditElement
      .setClickHandler(() => {
        replace(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      });
  }
}
