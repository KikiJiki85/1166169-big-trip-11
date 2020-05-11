import FiltersComponent from '../components/filter-menu.js';
import {FilterType} from '../utils/common.js';
import {render, replace} from '../utils/render.js';
import {getPointsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const allPoints = this._pointsModel.getPointsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getPointsByFilter(allPoints, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filtersComponent;

    this._filtersComponent = new FiltersComponent(filters);
    this._filtersComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filtersComponent, oldComponent);
    } else {
      render(container, this._filtersComponent);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
