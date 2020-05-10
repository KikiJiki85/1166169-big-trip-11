export default class Point {
  constructor() {
    this._points = [];
  }

  getPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  updatePoints(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [...this.points.slice(0, index), point, ...this._points.slice(index + 1)];

    return true;
  }
}
