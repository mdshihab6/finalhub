// movie-details.js

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

document.addEventListener('DOMContentLoaded', function() {
  const movieId = parseInt(getQueryParam('id'), 10);
  const movies = typeof getMovies === 'function' ? getMovies() : [];
  const movie = movies.find(m => m.id === movieId);
  if (!movie) {
    document.getElementById('movie-details-container').innerHTML = '<div style="color:#fff;font-size:1.5rem;">Movie not found.</div>';
    return;
  }

  // Render details
  const detailsContainer = document.getElementById('movie-details-container');
  const categories = Array.isArray(movie.category) ? movie.category : [movie.category];
  const catLabels = categories.map(cat => `<span class='movie-details-category'>${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>`).join(' ');
  detailsContainer.innerHTML = `
    <div class="movie-details-image">
      <img src="${movie.image}" alt="${movie.title}">
    </div>
    <div class="movie-details-info">
      <div class="movie-details-title">${movie.title}</div>
      <div>${catLabels}</div>
      <div class="movie-details-imdb">${renderStars(movie.imdb)} <span style='margin-left:0.5em;'>${movie.imdb}</span></div>
      <div class="movie-details-release">Release: ${movie.releaseDate}</div>
      <div class="movie-details-desc" style="color:#ccc;">${movie.description || ''}</div>
    </div>
  `;

  // Render download table
  const downloadSection = document.getElementById('download-section');
  downloadSection.innerHTML = `
    <table class="download-table">
      <thead>
        <tr><th>Quality</th><th>Size</th><th>Download</th></tr>
      </thead>
      <tbody>
        ${movie.downloads.map(dl => `
          <tr>
            <td>${dl.quality}</td>
            <td>${dl.size}</td>
            <td><a href="${dl.link}" class="download-btn" target="_blank">Download</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Render similar movies (any shared category, exclude self)
  const similar = movies.filter(m => m.id !== movie.id && (Array.isArray(m.category) ? m.category.some(cat => categories.includes(cat)) : categories.includes(m.category))).slice(0, 5);
  const similarList = document.getElementById('similar-movies-list');
  similarList.innerHTML = similar.map(m => `
    <div class="similar-movie-card" onclick="window.location.href='movie.html?id=${m.id}'">
      <img src="${m.image}" alt="${m.title}">
      <div class="similar-movie-title">${m.title}</div>
    </div>
  `).join('');
});

function renderStars(rating) {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1 ? 1 : (rating % 1 >= 0.5 ? 1 : 0);
  let html = '';
  for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star"></i>';
  if (halfStar) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = fullStars + halfStar; i < 5; i++) html += '<i class="far fa-star"></i>';
  return html;
} 