import AbstractComponent from "./abstract-component.js";

const createTripDayTemplate = (date, day) => {

  let tripMonth = date && new Date(date).toLocaleString(`en-US`, {month: `short`});
  let tripDate = new Date(date).getDate();

  return (`<li class="trip-days__item  day">
  <div class="day__info">
    <span class="day__counter">${day || ``}</span>
    <time class="day__date" datetime="${date || ``}">
    ${ tripMonth || ``}
    ${ tripDate || ``}
    </time>
  </div>
<ul class="trip-events__list">
</ul>
</li>
  `);
};

export default class TripDay extends AbstractComponent {
  constructor(date, day) {
    super();
    this._date = date;
    this._day = day;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._day);
  }
}

