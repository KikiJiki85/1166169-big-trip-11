import AbstractComponent from "./abstract-component.js";

const createTripMenuTemplate = (menuItems) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuItems
      .map((item) => {
        return `<a class="trip-tabs__btn  ${item.active && `trip-tabs__btn--active`}" href="#">${item.name}</a>`;
      })
      .join(``)}
    </nav>`;
};

export default class TripMenu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createTripMenuTemplate(this._menuItems);
  }
}
