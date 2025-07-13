// movies.js

// Sample movie data structure
const defaultMovies = [
  {
    id: 1,
    title: "Rebel Moon – Chapter One: Chalice of Blood",
    description: "A new sci-fi epic.",
    image: "./assets/owl-wrapper/imaage01.jpg",
    imdb: 7.2,
    releaseDate: "2024-01-01",
    category: "feature",
    downloads: [
      { quality: "4K 2160p", size: "5.2GB", link: "#" },
      { quality: "Full HD 1080p", size: "2.4GB", link: "#" },
      { quality: "HD 720p", size: "1.2GB", link: "#" },
      { quality: "HD 720p HEVC", size: "900MB", link: "#" },
      { quality: "SD 480p", size: "700MB", link: "#" },
      { quality: "SD 360p", size: "400MB", link: "#" }
    ]
  },
  {
    id: 2,
    title: "The Last of Us : Season 2",
    description: "Post-apocalyptic drama.",
    image: "./assets/owl-wrapper/imaage02.jpg",
    imdb: 8.5,
    releaseDate: "2024-03-15",
    category: "latest",
    downloads: [
      { quality: "4K 2160p", size: "6.1GB", link: "#" },
      { quality: "Full HD 1080p", size: "2.8GB", link: "#" },
      { quality: "HD 720p", size: "1.4GB", link: "#" },
      { quality: "HD 720p HEVC", size: "1GB", link: "#" },
      { quality: "SD 480p", size: "800MB", link: "#" },
      { quality: "SD 360p", size: "500MB", link: "#" }
    ]
  }
  // Add more sample movies as needed
];

// Utility functions for localStorage persistence
function getMovies() {
  const data = localStorage.getItem('movies');
  return data ? JSON.parse(data) : defaultMovies;
}

function saveMovies(movies) {
  localStorage.setItem('movies', JSON.stringify(movies));
}

// On first load, initialize if not present
if (!localStorage.getItem('movies')) {
  saveMovies(defaultMovies);
} 