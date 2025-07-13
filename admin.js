// admin.js

const ADMIN_USER = 'sr64';
const ADMIN_PASS = '23@';

function isLoggedIn() {
  return localStorage.getItem('admin_logged_in') === '1';
}

function setLoggedIn(val) {
  if (val) localStorage.setItem('admin_logged_in', '1');
  else localStorage.removeItem('admin_logged_in');
}

document.addEventListener('DOMContentLoaded', function() {
  renderAdmin();
});

function renderAdmin() {
  const root = document.getElementById('admin-root');
  if (!isLoggedIn()) {
    root.innerHTML = `
      <form class="admin-login-form" id="admin-login-form">
        <h2>Admin Login</h2>
        <input type="text" id="admin-username" placeholder="Username" required autocomplete="username">
        <input type="password" id="admin-password" placeholder="Password" required autocomplete="current-password">
        <button type="submit">Login</button>
      </form>
    `;
    document.getElementById('admin-login-form').onsubmit = function(e) {
      e.preventDefault();
      const user = document.getElementById('admin-username').value;
      const pass = document.getElementById('admin-password').value;
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        setLoggedIn(true);
        renderAdmin();
      } else {
        alert('Invalid credentials');
      }
    };
    return;
  }
  renderPanel();
}

function renderPanel() {
  const root = document.getElementById('admin-root');
  const movies = getMovies();
  root.innerHTML = `
    <div class="admin-container">
      <div class="admin-panel-header">
        <h2>Movie Posts</h2>
        <button class="admin-logout-btn" id="admin-logout-btn">Logout</button>
      </div>
      <div id="admin-movie-form-container"></div>
      <button id="add-movie-btn" style="margin-bottom:1.5rem;">Add New Movie</button>
      <table class="admin-movie-table">
        <thead>
          <tr><th>Title</th><th>Categories</th><th>IMDb</th><th>Release</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${movies.map(m => `
            <tr>
              <td>${m.title}</td>
              <td>${Array.isArray(m.category) ? m.category.map(cat => `<span class='admin-cat-badge'>${cat}</span>`).join(' ') : `<span class='admin-cat-badge'>${m.category}</span>`}</td>
              <td>${m.imdb}</td>
              <td>${m.releaseDate}</td>
              <td class="admin-movie-actions">
                <button class="edit" data-id="${m.id}">Edit</button>
                <button class="delete" data-id="${m.id}">Delete</button>
                <button class="preview" data-id="${m.id}">Preview</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('admin-logout-btn').onclick = function() {
    setLoggedIn(false);
    renderAdmin();
  };
  document.getElementById('add-movie-btn').onclick = function() {
    renderMovieForm();
  };
  root.querySelectorAll('.edit').forEach(btn => {
    btn.onclick = function() {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      renderMovieForm(movies.find(m => m.id === id));
    };
  });
  root.querySelectorAll('.delete').forEach(btn => {
    btn.onclick = function() {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      if (confirm('Delete this movie?')) {
        const updated = movies.filter(m => m.id !== id);
        saveMovies(updated);
        renderPanel();
      }
    };
  });
  root.querySelectorAll('.preview').forEach(btn => {
    btn.onclick = function() {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      window.open(`movie.html?id=${id}`, '_blank');
    };
  });
}

// Define all categories for admin panel
const ALL_CATEGORIES = [
  'feature',
  'latest',
  'anime',
  'action',
  'adventure',
  'biography',
  'oscar',
  'top250',
  'superhero',
  '4k',
  '1080p',
  'sports',
  'cartoon',
  'bollywood',
  'hollywood',
  'tamil',
  'telugu',
  'malayalam',
  'kannada',
  'korean',
  'japanese',
  'chinese',
  'turkish',
  'spanish',
  'dual',
  'hindi-dubbed',
  'hevc',
  'tv',
  'web',
  'foreign',
];

function renderMovieForm(movie) {
  const container = document.getElementById('admin-movie-form-container');
  const isEdit = !!movie;
  const downloads = isEdit ? movie.downloads : [
    { quality: '4K 2160p', size: '', link: '' },
    { quality: 'Full HD 1080p', size: '', link: '' },
    { quality: 'HD 720p', size: '', link: '' },
    { quality: 'HD 720p HEVC', size: '', link: '' },
    { quality: 'SD 480p', size: '', link: '' },
    { quality: 'SD 360p', size: '', link: '' }
  ];
  const selectedCategories = isEdit && Array.isArray(movie.category) ? movie.category : (isEdit && movie.category ? [movie.category] : []);
  container.innerHTML = `
    <form class="admin-movie-form" id="admin-movie-form">
      <h3>${isEdit ? 'Edit' : 'Add'} Movie</h3>
      <label>Title</label>
      <input type="text" id="movie-title" value="${isEdit ? movie.title : ''}" required>
      <label>Description</label>
      <textarea id="movie-desc" rows="3">${isEdit ? movie.description : ''}</textarea>
      <label>Image Link</label>
      <input type="text" id="movie-image" value="${isEdit ? movie.image : ''}" required>
      <label>IMDb Rating</label>
      <input type="number" id="movie-imdb" min="0" max="10" step="0.1" value="${isEdit ? movie.imdb : ''}" required>
      <label>Release Date</label>
      <input type="date" id="movie-release" value="${isEdit ? movie.releaseDate : ''}" required>
      <label>Categories (hold Ctrl/Cmd to select multiple)</label>
      <select id="movie-category" multiple required size="6" style="height:auto;min-height:120px;">
        ${ALL_CATEGORIES.map(cat => `<option value="${cat}" ${selectedCategories.includes(cat) ? 'selected' : ''}>${cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}</option>`).join('')}
      </select>
      <label>Download Links</label>
      <div class="download-links" id="download-links">
        ${downloads.map((dl, i) => `
          <div class="download-link-row">
            <input type="text" placeholder="Quality" value="${dl.quality || ''}" class="dl-quality">
            <input type="text" placeholder="Size" value="${dl.size || ''}" class="dl-size">
            <input type="text" placeholder="Download Link" value="${dl.link || ''}" class="dl-link">
            <button type="button" class="remove-download-link" data-idx="${i}">&times;</button>
          </div>
        `).join('')}
      </div>
      <button type="button" id="add-download-link">Add Download Option</button>
      <div style="margin-top:1em;display:flex;gap:1em;">
        <button type="submit">${isEdit ? 'Update' : 'Add'} Movie</button>
        <button type="button" id="cancel-movie-form">Cancel</button>
        <button type="button" id="preview-movie-form">Preview</button>
      </div>
    </form>
    <div id="admin-preview-modal" style="display:none;"></div>
  `;
  document.getElementById('cancel-movie-form').onclick = function() {
    container.innerHTML = '';
  };
  document.getElementById('add-download-link').onclick = function() {
    const dlDiv = document.createElement('div');
    dlDiv.className = 'download-link-row';
    dlDiv.innerHTML = `
      <input type="text" placeholder="Quality" class="dl-quality">
      <input type="text" placeholder="Size" class="dl-size">
      <input type="text" placeholder="Download Link" class="dl-link">
      <button type="button" class="remove-download-link">&times;</button>
    `;
    dlDiv.querySelector('.remove-download-link').onclick = function() {
      dlDiv.remove();
    };
    document.getElementById('download-links').appendChild(dlDiv);
  };
  container.querySelectorAll('.remove-download-link').forEach(btn => {
    btn.onclick = function() {
      btn.parentElement.remove();
    };
  });
  document.getElementById('admin-movie-form').onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('movie-title').value.trim();
    const description = document.getElementById('movie-desc').value.trim();
    const image = document.getElementById('movie-image').value.trim();
    const imdb = parseFloat(document.getElementById('movie-imdb').value);
    const releaseDate = document.getElementById('movie-release').value;
    const categorySelect = document.getElementById('movie-category');
    const category = Array.from(categorySelect.selectedOptions).map(opt => opt.value);
    const downloads = Array.from(document.querySelectorAll('.download-link-row')).map(row => ({
      quality: row.querySelector('.dl-quality').value.trim(),
      size: row.querySelector('.dl-size').value.trim(),
      link: row.querySelector('.dl-link').value.trim()
    })).filter(dl => dl.quality && dl.size && dl.link);
    let movies = getMovies();
    if (isEdit) {
      movies = movies.map(m => m.id === movie.id ? { ...m, title, description, image, imdb, releaseDate, category, downloads } : m);
    } else {
      const newId = movies.length ? Math.max(...movies.map(m => m.id)) + 1 : 1;
      movies.push({ id: newId, title, description, image, imdb, releaseDate, category, downloads });
    }
    saveMovies(movies);
    container.innerHTML = '';
    renderPanel();
  };
  document.getElementById('preview-movie-form').onclick = function() {
    const title = document.getElementById('movie-title').value.trim();
    const description = document.getElementById('movie-desc').value.trim();
    const image = document.getElementById('movie-image').value.trim();
    const imdb = parseFloat(document.getElementById('movie-imdb').value);
    const releaseDate = document.getElementById('movie-release').value;
    const category = Array.from(document.getElementById('movie-category').selectedOptions).map(opt => opt.value);
    const downloads = Array.from(document.querySelectorAll('.download-link-row')).map(row => ({
      quality: row.querySelector('.dl-quality').value.trim(),
      size: row.querySelector('.dl-size').value.trim(),
      link: row.querySelector('.dl-link').value.trim()
    })).filter(dl => dl.quality && dl.size && dl.link);
    const preview = {
      id: movie ? movie.id : 0,
      title, description, image, imdb, releaseDate, category, downloads
    };
    showPreviewModal(preview);
  };
}

function showPreviewModal(movie) {
  const modal = document.getElementById('admin-preview-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div style="background:#222;padding:2rem;border-radius:10px;max-width:600px;margin:2rem auto;">
      <h2 style="color:#fff;">Preview</h2>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
        <img src="${movie.image}" alt="${movie.title}" style="width:160px;border-radius:8px;">
        <div>
          <div style="font-size:1.3rem;font-weight:700;color:#fff;">${movie.title}</div>
          <div style="background:#e50914;color:#fff;display:inline-block;padding:0.2em 0.8em;border-radius:5px;font-size:1rem;font-weight:600;">${movie.category}</div>
          <div style="color:#f5c518;font-size:1.1rem;font-weight:600;margin-top:0.5em;">IMDb: ${movie.imdb}</div>
          <div style="color:#aaa;">Release: ${movie.releaseDate}</div>
        </div>
      </div>
      <div style="margin:1em 0;color:#ccc;">${movie.description}</div>
      <table style="width:100%;background:#181818;border-radius:8px;overflow:hidden;">
        <thead><tr><th style="color:#fff;background:#333;padding:0.7em;">Quality</th><th style="color:#fff;background:#333;padding:0.7em;">Size</th><th style="color:#fff;background:#333;padding:0.7em;">Download</th></tr></thead>
        <tbody>
          ${movie.downloads.map(dl => `<tr><td style='color:#eee;padding:0.7em;'>${dl.quality}</td><td style='color:#eee;padding:0.7em;'>${dl.size}</td><td style='padding:0.7em;'><a href="${dl.link}" target="_blank" style="background:#e50914;color:#fff;padding:0.4em 1em;border-radius:5px;text-decoration:none;">Download</a></td></tr>`).join('')}
        </tbody>
      </table>
      <button onclick="this.parentElement.parentElement.style.display='none'" style="margin-top:1.5em;background:#e50914;color:#fff;border:none;padding:0.7em 1.5em;border-radius:5px;font-weight:600;cursor:pointer;">Close Preview</button>
    </div>
  `;
}

// Add improved button styles
const style = document.createElement('style');
style.innerHTML = `
.admin-container button,
.admin-movie-actions button,
.admin-login-form button,
.admin-movie-form button,
#add-movie-btn {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6em 1.3em;
  font-size: 1em;
  font-weight: 600;
  margin: 0 0.2em 0.5em 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  outline: none;
  cursor: pointer;
  display: inline-block;
}
.admin-container button:hover,
.admin-movie-actions button:hover,
.admin-login-form button:hover,
.admin-movie-form button:hover,
#add-movie-btn:hover {
  background: #e50914;
  color: #fff;
  box-shadow: 0 4px 12px rgba(229,9,20,0.12);
}
.admin-movie-actions button.delete {
  background: #e50914;
  color: #fff;
}
.admin-movie-actions button.delete:hover {
  background: #b0060f;
}
.admin-movie-actions button.edit {
  background: #1e90ff;
  color: #fff;
}
.admin-movie-actions button.edit:hover {
  background: #1565c0;
}
.admin-movie-actions button.preview {
  background: #f5c518;
  color: #222;
}
.admin-movie-actions button.preview:hover {
  background: #ffe066;
  color: #222;
}
.admin-movie-form .remove-download-link {
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3em 0.7em;
  cursor: pointer;
  font-size: 1em;
  margin-left: 0.3em;
}
.admin-movie-form .remove-download-link:hover {
  background: #b0060f;
}
`;
document.head.appendChild(style); 