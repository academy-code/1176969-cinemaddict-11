import AbstractComponent from "../abstract.js";

export default class MovieContainer extends AbstractComponent {
  getTemplate() {
    return `<section class="films"></section>`;
  }
}
