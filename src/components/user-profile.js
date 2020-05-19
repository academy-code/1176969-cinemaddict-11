import AbstractComponent from "./abstract.js";
import {getControlsCount} from "../utils/common.js";
import {ControlsPath} from "./filters.js";

const UserRanks = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`,
};

export default class UserProfile extends AbstractComponent {
  constructor(movies) {
    super();

    this._movies = movies;
  }

  getTemplate() {
    return (
      `<section class="header__profile profile">
      <p class="profile__rating">${this._getUserRating()}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
    );
  }

  _getUserRating() {
    let userRank = null;
    const userWatchedCount = getControlsCount(this._movies, ControlsPath.WATCHED);

    if (userWatchedCount > 1 && userWatchedCount <= 10) {
      userRank = UserRanks.NOVICE;
    } else if (userWatchedCount > 10 && userWatchedCount <= 20) {
      userRank = UserRanks.FAN;
    } else if (userWatchedCount > 20) {
      userRank = UserRanks.MOVIE_BUFF;
    } else {
      userRank = ``;
    }

    return userRank;
  }
}
