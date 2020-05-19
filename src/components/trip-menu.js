import AbstractComponent from "./abstract-component.js";

const ACTIVE_MENU_CLASS = `trip-tabs__btn--active`;

const createTripMenuTemplate = (menuItems) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuItems
      .map((item) => {
        return `<a class="trip-tabs__btn ${item.active ? ACTIVE_MENU_CLASS : ``}" href="#" id="${item.name}">${item.name}</a>`;
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

  setActiveItem(selectedItem) {
    this.getElement()
      .querySelectorAll(`.trip-tabs__btn`)
      .forEach((_item) => {
        if (_item.id === selectedItem) {
          _item.classList.add(ACTIVE_MENU_CLASS);
        } else {
          _item.classList.remove(ACTIVE_MENU_CLASS);
        }
      });
  }

  setChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}
