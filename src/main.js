// watchlist.js
function renderWatchlist() {
  const films = document.getElementById("films");
  watchlist = JSON.parse(localStorage.getItem("watchlist"));
  if (!watchlist || watchlist.length === 0) {
    films.innerHTML = `
    <div class="films-block">
                <p class="films-text">Your watchlist is looking a little empty...</p>
                <a class="films-link" href="../index.html">
                    <img class="films-img" src="/images/Icon1.svg" alt="plus">
                    <span class="films-span">Let’s add some movies!</span>
                </a>
                </div>`;
  } else {
    films.innerHTML = watchlist.map((item, index) => {
      return `<div key=${index} class="inner-main">
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
                            <button class="remove-btn" data-id="${item.imdbID}"><img class="middle-img" src="/images/Icon2.svg" alt="plus"><span class="middle-span">Remove</span></button>
                        </div>
                        <p class="bottom">A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.</p>
                    </div>
                </div>`;
    });
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const movieId = e.target.closest(".remove-btn").dataset.id;
        removeFromWatchlist(movieId);
      });
    });
  }
}

function removeFromWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((movie) => movie.imdbID !== movieId);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist(); // Перерисовываем список после удаления
}

// Запускаем при загрузке страницы
document.addEventListener("DOMContentLoaded", renderWatchlist);
