import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoryListEmptyTemplate,
  generateStoryListErrorTemplate,
} from "../../templates";
import BookmarkPresenter from "./bookmark-presenter";
import Database from "../../data/database";
import Map from "../../utils/map";

export default class BookmarkPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="story-list__map__container">
          <div id="map" class="story-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
 
      <section class="container">
        <div class="section-header">
          <h1 class="section-title">Daftar Curhatan Tersimpan</h1>
          <p>Koleksi curhatan pengguna lain yang Anda simpan</p>
        </div>
 
        <div class="story-list__container">
          <div id="story-list"></div>
          <div id="story-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateBookmarkedStory(message, story) {
    if (story.length <= 0) {
      this.populateBookmarkedStoryListEmpty();
      return;
    }

    const html = story.reduce((accumulator, story) => {
      const location = {
        lat: story.lat,
        lon: story.lon,
      };

      const locationString = `${location.lat}, ${location.lon}`;

      if (this.#map && location.lat !== null && location.lon !== null) {
        const coordinate = [location.lat, location.lon];

        const markerOptions = { alt: `Cerita oleh ${story.name}` };
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

  populateBookmarkedStoryListEmpty() {
    document.getElementById("story-list").innerHTML =
      generateStoryListEmptyTemplate();
  }

  populateBookmarkedStoryError(message) {
    document.getElementById("story-list").innerHTML =
      generateStoryListErrorTemplate(message);
  }

  showStoryListLoading() {
    document.getElementById("story-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryListLoading() {
    document.getElementById("story-list-loading-container").innerHTML = "";
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
}
