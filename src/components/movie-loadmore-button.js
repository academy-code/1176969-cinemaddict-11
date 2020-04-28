import {createElement} from "../utils.js";

const createShowMoreFilmsTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

class MovieLoadMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreFilmsTemplate();
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

export {MovieLoadMoreButton as default};
