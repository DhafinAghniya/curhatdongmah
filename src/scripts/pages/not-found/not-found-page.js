export default class NotFoundPage {
  render() {
    return `
      <section>
        <div class="section-header">
          <img src="/images/not-found-illustration.png" alt="Ilustrasi halaman tidak ditemukan">
          <div id="not-found-description" class="not-found-description">
            <h1 class="section-title">Halaman Tidak Ditemukan</h1>
            <p>Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
          </div>
        </div>
      </section>
    `;
  }
}
