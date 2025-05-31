export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoryListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showStoryListMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showStoryListLoading();

    try {
      await this.showStoryListMap();

      const listOfStory = await this.#model.getAllStory();

      if (!listOfStory || listOfStory.length === 0) {
        this.#view.populateBookmarkedStoryError("Belum ada curhatan tersimpan.");
        return;
      }

      const message = "Berhasil mendapatkan daftar curhatan tersimpan.";

      this.#view.populateBookmarkedStory(message, listOfStory);
    } catch (error) {
      console.error("initialGalleryAndMap: error:", error);
      this.#view.populateBookmarkedStoryError(error.message);
    } finally {
      this.#view.hideStoryListLoading();
    }
  }
}
