import {createElement} from "../utils.js";

const createTripMenuTemplate = (menuItems) => {
  return (`
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuItems
      .map((item) => {
        return `<a class="trip-tabs__btn  ${item.active && `trip-tabs__btn--active`}" href="#">${item.name}</a>`;
      })
      .join(``)}
    </nav>
  `);
};

export default class TripMenu {
  constructor(menuItems) {
    this._menuItems = menuItems;
    this._element = null;
  }

  getTemplate() {
    return createTripMenuTemplate(this._menuItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
