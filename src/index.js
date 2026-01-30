const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const btnMain = document.getElementById("btn-main");
const searchInput = document.getElementById("search-input");
const block = document.getElementById("block");
const movies = document.getElementById("movies");
const list = document.getElementById("list");
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=1`,
  );
  const data = await res.json();
  if (!data.Search) {
    movies.innerHTML = `<p class='empty'>Unable to find what you’re looking for. Please try another search.</p>`;
    searchInput.value = "";
  } else {
    async function getMovieDetails(id) {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`,
      );
      return await res.json();
    }
    const moviesFull = await Promise.all(
      data.Search.map((movie) => getMovieDetails(movie.imdbID)),
    );
    console.log(data);
    movies.innerHTML = moviesFull.map((item, index) => {
      return `<div key=${index} class="inner">
                    <img class="inner-img" src=${item.Poster} alt="poster" />
                    <div class="right">
                        <div class="top">
                            <h3 class="top-title">${item.Title}</h3>
                            <img class="top-img" src="/images/Icon4.svg" alt="star" />
                            <p class="number">${item.imdbRating}</p>
                        </div>
                        <div class="middle">
                            <p class="middle-time">${item.Runtime}</p>
                            <p class="middle-ganre">${item.Genre}</p>
                            <button class="middle-btn" data-id="${item.imdbID}"><img class="middle-img" src="/images/Icon1.svg" alt="plus"><span class="middle-span">Watchlist</span></button>
                        </div>
                        <p class="bottom">A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.</p>
                    </div>
                </div>`;
    });
    searchInput.value = "";
  }
}
btnMain.addEventListener("click", searchMovies);

function addToWatchlist(movie) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const alreadyExists = watchlist.some((item) => item.imdbID === movie.imdbID);
  if (alreadyExists) return;

  watchlist.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

movies.addEventListener("click", async (e) => {
  if (!e.target.closest(".middle-btn")) return;

  const btn = e.target.closest(".middle-btn");
  const movieId = btn.dataset.id;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`,
  );
  const movie = await res.json();

  addToWatchlist(movie);
});
function renderWatchlist() {
  const films = document.getElementById("films");
  watchlist = JSON.parse(localStorage.getItem("watchlist"));
  if (!watchlist) {
    films.innerHTML = `
    <div class="films-block">
                <p class="films-text">Your watchlist is looking a little empty...</p>
                <a class="films-link" href="/index.html">
                    <img class="films-img" src="/images/Icon1.svg" alt="plus">
                    <span class="films-span">Let’s add some movies!</span>
                </a>
                </div>`;
  } else {
    films.innerHTML = watchlist.map((item, index) => {
      return `<div key=${index} class="inner">
                    <img class="inner-img" src=${item.Poster} alt="poster" />
                    <div class="right">
                        <div class="top">
                            <h3 class="top-title">${item.Title}</h3>
                            <img class="top-img" src="/images/Icon4.svg" alt="star" />
                            <p class="number">${item.imdbRating}</p>
                        </div>
                        <div class="middle">
                            <p class="middle-time">${item.Runtime}</p>
                            <p class="middle-ganre">${item.Genre}</p>
                            <button class="middle-btn" data-id="${item.imdbID}"><img class="middle-img" src="/images/Icon1.svg" alt="plus"><span class="middle-span">Watchlist</span></button>
                        </div>
                        <p class="bottom">A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.</p>
                    </div>
                </div>`;
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const films = document.getElementById("films");
  if (!films) return;

  renderWatchlist();
});
