import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoryListEmptyTemplate,
  generateStoryListErrorTemplate,
} from "../../templates";
import HomePresenter from "./home-presenter";
import * as StoryAPI from "../../data/api";
import Map from "../../utils/map";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="jumbotron">
          <div class="jumbotron-container">
            <div class="jumbotron-content">
              <h1>Curhat Yuk Ke Mamah!</h1>
              <p>Bagikan Curhatan - Curhatan Tentang Kehidupunk</p>
              <a href="#/new"><button class="btn">Mulai Bagikan Curhatan</button></a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h1 class="section-title">Peta Lokasi</h1>
          <p>Kumpulan curhatan berdasarkan lokasi yang dibagikan</p>
        </div>
        <div class="story-list__map__container">
          <div id="map" class="story-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <div class="section-header">
          <h1 class="section-title">Kumpulan Curhatan</h1>
          <p>Baca curhatan pengguna dan resapilah!</p>
        </div>
        <div class="story-list__container">
          <div id="story-list"></div>
          <div id="story-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateStoryList(message, listStory) {
    if (listStory.length <= 0) {
      this.populateStoryListEmpty();
      return;
    }

    const html = listStory.reduce((accumulator, story) => {
      const location = {
        lat: story.lat,
        lon: story.lon,
      };

      const locationString = `${location.lat}, ${location.lon}`;

      if (this.#map && location.lat !== null && location.lon !== null) {
        const coordinate = [location.lat, location.lon];

        const markerOptions = { alt: `Curhatan oleh ${story.name}` };
        const popupOptions = { content: story.description };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          locationString,
        })
      );
    }, "");

    document.getElementById("story-list").innerHTML = `
      <div class="story-list">${html}</div>
    `;
  }

  populateStoryListEmpty() {
    document.getElementById("story-list").innerHTML =
      generateStoryListEmptyTemplate();
  }

  populateStoryListError(message) {
    document.getElementById("story-list").innerHTML =
      generateStoryListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showLoading() {
    document.getElementById("story-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("story-list-loading-container").innerHTML = "";
  }
}
