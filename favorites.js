
const favoritesGrid = document.getElementById("favoritesGrid");
const favoritesEmpty = document.getElementById("favoritesEmpty");


/* SHOW FAVORITES */

function renderFavorites() {
    if (!favoritesGrid) return;

    const favoriteProducts = products.filter(product =>
        favorites.includes(product.id)
    );

    if (favoriteProducts.length === 0) {
        favoritesGrid.innerHTML = "";
        favoritesEmpty.classList.add("visible");
        return;
    }

    favoritesEmpty.classList.remove("visible");

    favoritesGrid.innerHTML = favoriteProducts.map(product => `
        <article class="product-card">

            <div class="product-image-wrapper">

                <a href="product.html?id=${product.id}">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="product-image"
                        loading="lazy"
                    >
                </a>

                <button
                    class="favorite-button active"
                    data-favorite="${product.id}"
                    aria-label="Видалити з уподобаних"
                >
                    ♥
                </button>

            </div>

            <div class="product-info">

                <p class="product-brand">${product.brand}</p>

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-to-cart"
                        data-cart="${product.id}"
                    >
                        До кошика +
                    </button>

                </div>

            </div>

        </article>
    `).join("");
}


/* UPDATE AFTER REMOVING FAVORITE */

document.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-favorite]");

    if (favoriteButton && favoritesGrid) {
        renderFavorites();
    }
});


/* INITIALIZE */

document.addEventListener("DOMContentLoaded", () => {
    renderFavorites();
});
