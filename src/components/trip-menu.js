export const createTripMenuTemplate = (menuItems) => {
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
