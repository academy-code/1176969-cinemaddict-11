import {render, remove} from "../utils/render.js";
import {
  SHOWING_EXTRA_MOVIES_COUNT,
  SHOWING_MOVIES_COUNT_BY_BUTTON,
  SHOWING_MOVIES_COUNT_ON_START,
  ExtraListTitles,
  HIDDEN_CLASS,
} from "../const.js";
import {getSortedMovies} from "../utils/sort.js";
import {getExtraData} from "../utils/extra-movie";

import NormalListComponent from "../components/movies/normal-list/normal-list.js";
import NormalTitleComponent from "../components/movies/normal-list/normal-title.js";
import NormalCardContainerComponent from "../components/movies/normal-list/normal-card-container.js";
import ShowMoreButtonComponent from "../components/movies/show-more-button.js";
import NoDataComponent from "../components/movies/no-data.js";
import ExtraListComponent from "../components/movies/extra-list/extra-list.js";
import ExtraTitleComponent from "../components/movies/extra-list/extra-title.js";
import ExtraCardContainerComponent from "../components/movies/extra-list/extra-card-container.js";
import SortComponent from "../components/sort.js";
import MovieContainerComponent from "../components/movies/container.js";
import MovieController from "./movie-controller.js";

export default class PageController {
  constructor(container, moviesModel, commentsModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._movies = null;
    this._api = api;
    this._commentsModel = commentsModel;
    this._comments = this._commentsModel.getComments();
    this._showMoviesCount = null;
    this._newMovies = null;
    this._showedMovieControllers = [];

    this._sortComponent = new SortComponent();
    this._mainMovieListsComponent = new MovieContainerComponent();
    this._normalListComponent = new NormalListComponent();
    this._normalTitleComponent = new NormalTitleComponent();
    this._normalCardContainerComponent = new NormalCardContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noDataComponent = new NoDataComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);


    this._normalListElement = this._normalListComponent.getElement();
    this._normalCardContainerElement = this._normalCardContainerComponent.getElement();
    this._mainMovieListsElement = this._mainMovieListsComponent.getElement();
    this._sortElement = this._sortComponent.getElement();

    this._moviesModel.setFilterDataChangeListener(this._onFilterChange);
  }

  render() {
    this._movies = this._moviesModel.getMovies();
    render(this._container, this._sortComponent);
    render(this._container, this._mainMovieListsComponent);
    this._sortComponent.setSortButtonClickListener((sortType) => this._onSortButtonClick(sortType, this._movies));

    this._renderNormalList(this._movies, this._comments);
    this._renderExtraLists(this._movies);
  }

  show() {
    this._mainMovieListsElement.classList.remove(HIDDEN_CLASS);
    this._sortElement.classList.remove(HIDDEN_CLASS);
  }

  hide() {
    this._mainMovieListsElement.classList.add(HIDDEN_CLASS);
    this._sortElement.classList.add(HIDDEN_CLASS);
  }

  removeMovieContainer(movieFilterData) {
    this._renderMovieCard(this._normalCardContainerElement, movieFilterData, this._onDataChange,
        this._onViewChange, this._comments, this._api, this._onCommentChange);
  }

  _renderMovieCard(container, moviesData, onDataChange, onViewChange, comments, api, onCommentChange) {
    return moviesData.map((movie) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, api, onCommentChange);
      movieController.render(movie, comments[movie.id]);

      return movieController;
    });
  }

  _renderNewMoviesCard(container, movies, comments = this._comments) {
    // TODO: container moviesData onDataChange onViewChange comments api onCommentChange
    this._newMovies = this._renderMovieCard(container, movies,
        this._onDataChange, this._onViewChange, comments, this._api, this._onCommentChange);
  }

  _onSortButtonClick(sortType, moviesData) {
    this._showMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    const sortedMovies = getSortedMovies(sortType, moviesData, 0, this._showMoviesCount);

    this._normalCardContainerElement.innerHTML = ``;
    remove(this._showMoreButtonComponent);

    this._renderNewMoviesCard(this._normalCardContainerElement, sortedMovies);
    this._showedMovieControllers = this._showedMovieControllers.concat(this._newMovies);

    this._renderShowMoreButton(moviesData);
  }

  _onShowMoreButtonClick(moviesData) {
    const prevMovieShowCount = this._showMoviesCount;
    this._showMoviesCount = this._showMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;

    const sortedMovies = getSortedMovies(this._sortComponent.getSortType(), moviesData, prevMovieShowCount, this._showMoviesCount);

    this._renderNewMoviesCard(this._normalCardContainerElement, sortedMovies);
    this._showedMovieControllers = this._showedMovieControllers.concat(this._newMovies);

    if (this._showMoviesCount >= moviesData.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton(moviesData) {
    if (moviesData.length > this._showMoviesCount) {
      render(this._normalListElement, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setClickListener(() => this._onShowMoreButtonClick(moviesData));
    }
  }

  _renderNormalList(moviesData, comments) {
    render(this._mainMovieListsElement, this._normalListComponent);

    if (!moviesData.length) {
      render(this._normalListElement, this._noDataComponent);

      return;
    }

    render(this._normalListElement, this._normalTitleComponent);
    render(this._normalListElement, this._normalCardContainerComponent);

    this._showMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    this._renderNewMoviesCard(this._normalCardContainerElement, moviesData.slice(0, this._showMoviesCount), comments);
    this._showedMovieControllers = this._showedMovieControllers.concat(this._newMovies);

    this._renderShowMoreButton(moviesData);
  }

  _renderExtraCard(title, movieSortData) {
    const extraList = new ExtraListComponent();
    const extraTitle = new ExtraTitleComponent(title);
    const extraContainer = new ExtraCardContainerComponent();
    const copyMoviesSortData = movieSortData.slice();

    render(this._mainMovieListsComponent.getElement(), extraList);
    render(extraList.getElement(), extraTitle);
    render(extraList.getElement(), extraContainer);

    for (let i = 1; i <= SHOWING_EXTRA_MOVIES_COUNT; i++) {

      this._renderNewMoviesCard(extraContainer.getElement(), copyMoviesSortData.splice(0, i));
      this._showedMovieControllers = this._showedMovieControllers.concat(this._newMovies);
    }
  }

  _renderExtraLists(moviesData) {
    if (moviesData.length) {
      const sortMovieData = getExtraData(moviesData, SHOWING_EXTRA_MOVIES_COUNT);

      const maxRatingsInMovieData = sortMovieData.topRated;
      const maxCommentsInMovieData = sortMovieData.mostCommented;

      if (maxRatingsInMovieData[0].movieInfo.totalRating !== 0) {
        this._renderExtraCard(ExtraListTitles.TOP_RATED, maxRatingsInMovieData);
      }

      if (maxCommentsInMovieData[0].comments.length !== 0) {
        this._renderExtraCard(ExtraListTitles.MOST_COMMENTED, maxCommentsInMovieData);
      }
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((movie) => {
      movie.setDefaultView();
    });
  }

  _onFilterChange() {
    this._showMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
    this._updateMovieCards(this._showMoviesCount);
  }

  _updateMovieCards(count) {
    this._showMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    this._showedMovieControllers.forEach((filmController) => filmController.destroy());
    this._showedMovieControllers = [];

    remove(this._showMoreButtonComponent);
    // TODO: сбрасываем сортироку
    this._sortComponent.resetSortToDefault();

    this._renderNewMoviesCard(this._normalCardContainerElement, this._moviesModel.getMovies().slice(0, count));
    this._showedMovieControllers = this._showedMovieControllers.concat(this._newMovies);

    this._renderShowMoreButton(this._moviesModel.getMovies());
  }

  _onDataChange(movieController, oldMoviesData, newUserDetailsData, elementScrollTop) {
    this._api.updateFilm(oldMoviesData.id, newUserDetailsData)
      .then((MovieModel) => {
        const isSuccess = this._moviesModel.updateFilm(oldMoviesData.id, MovieModel);

        if (isSuccess) {
          this._updateFilm(oldMoviesData, newUserDetailsData);
          movieController.movieDetailsComponent.getElement().scrollTo(0, elementScrollTop);
        }
      });
  }

  _onCommentChange(movieController, oldMoviesData, newUserDetailsData, newComments, elementScrollTop) {
    const isSuccess = this._commentsModel.updateComments(oldMoviesData.id, newComments)
      && this._moviesModel.updateFilm(oldMoviesData.id, newUserDetailsData);
    if (isSuccess) {
      this._updateFilm(oldMoviesData, newUserDetailsData);
    }

    movieController.movieDetailsComponent.getElement().scrollTo(0, elementScrollTop);
  }

  _updateFilm(oldMoviesData, newUserDetailsData) {
    const allShowedControllers = this._showedMovieControllers;
    const showedFilmControllers = allShowedControllers.filter((controller) => {
      return controller.getFilm() === oldMoviesData;
    });

    showedFilmControllers.forEach((controller) => {
      controller.render(newUserDetailsData, this._comments[newUserDetailsData.id]);
    });
  }
}
