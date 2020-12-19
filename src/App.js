import * as Data from './Data.js';
import getDistanceAndTime from './utils/getWeight.js';
import Result from './Result.js';

export default class App {
  initialState = {
    searchType: '최단거리',
    shortestPath: [],
    totalDistance: '',
    totalTime: '',
  }

  constructor(target) {
    this.target = target;
    this.state = this.initialState;
    this.fetchData();

    this.createHeader(target);
    this.createStationInput(target);
    this.createRadioButton(target);
    this.createSearchButton(target);

    this.resultContainer = document.createElement('div');
    this.resultContainer.className = 'result';
    target.appendChild(this.resultContainer);
  }

  fetchData() {
    this.shortestDistanceDijkstra = Data.fetchShortestDistanceDijkstra();
    this.shortestTimeDijkstra = Data.fetchShortestTimeDijkstra();
  }

  createHeader(target) {
    const header = document.createElement('header');
    header.innerHTML = `<h1>🚇 지하철 길찾기</h1>`;
    target.appendChild(header);
  }

  createStationInput(target) {
    const container = document.createElement('div');
    target.appendChild(container);
    container.className = 'station-input';

    container.innerHTML = `
      <div>
        <label for="departure">출발역</label>
        <input
          type="text"
          name="departure"
          id="departure-station-name-input"
        />
      </div>
      <div>
        <label for="arrival">도착역</label>
        <input
          type="text"
          name="arrival"
          id="arrival-station-name-input"
        />
      </div>
    `;
  }

  createRadioButton(target) {
    const container = document.createElement('div');
    target.appendChild(container);
    container.className = 'radio-button';

    container.innerHTML = `
      <label>
        <input
          type="radio"
          name="search-type"
          value="최단거리"
          checked
        /> 최단거리
      </label>
      <label>
        <input 
          type="radio"
          name="search-type"
          value="최소시간"
        /> 최소시간
      </label>
    `;
  }

  createSearchButton(target) {
    const { setState } = this;
    const container = document.createElement('div');
    target.appendChild(container);

    container.innerHTML = `<button id="search-button">길찾기</button>`;

    const addButton = document.querySelector('#search-button');
    addButton.addEventListener('click', setState.bind(this));
  }

  setState() {
    const startStation = document.querySelector('#departure-station-name-input').value;
    const endStation = document.querySelector('#arrival-station-name-input').value;
    const searchType = document.querySelector('input[name="search-type"]:checked').value;

    let shortestPath;
    if(searchType === '최단거리') {
      shortestPath = this.shortestDistanceDijkstra.findShortestPath(startStation, endStation);
    }
    else {
      shortestPath = this.shortestTimeDijkstra.findShortestPath(startStation, endStation);
    }
    const { totalDistance, totalTime } = getDistanceAndTime(shortestPath);
    this.state = { searchType, shortestPath, totalDistance, totalTime }
    this.renderResult();
  }

  renderResult() {
    const { searchType, shortestPath, totalDistance, totalTime } = this.state;
    this.resultContainer.innerHTML = ``;

    return new Result(this.resultContainer, {
      searchType,
      shortestPath,
      totalDistance,
      totalTime,
    })
  }
}