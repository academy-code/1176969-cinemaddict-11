// Перечисления места для вставки DOM-элемента
const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};
// Получаем произвольный item массива
const getRandomItem = (array) => { // изменить имя на getRandomItem
  const random = Math.floor(Math.random() * array.length);
  return array[random];
};
// Получаем произвольный index массива
const getRandomIndex = (array) => { // изменить имя на getRandomIndex
  return Math.floor(Math.random() * array.length);
};
// Получаем произвольное число от минимального и максимального
const getRandomIntervalNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};
// Функции для фильтров
const getWatchlistCount = (movieCards) => {
  return movieCards.filter((card) => card.isWatchlist);
};
const getWatchedCount = (movieCards) => {
  return movieCards.filter((card) => card.isWatched);
};
const getFavoriteCount = (movieCards) => {
  return movieCards.filter((card) => card.isFavorite);
};
// Функция для создания DOM-элемента
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
// Функция для отрисовки созданного DOM-элемента
const render = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {getRandomItem, getRandomIndex, getRandomIntervalNumber, getWatchlistCount, getWatchedCount, getFavoriteCount, createElement, render, RenderPosition};
