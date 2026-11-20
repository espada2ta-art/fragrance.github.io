
const products = [
    {
        id: 1,
        name: "Black Orchid",
        brand: "TOM FORD",
        price: 6200,
        category: "unisex",
        description: "Глибокий, насичений та загадковий аромат.",
        image: "images/perfume-01.jpg"
    },
    {
        id: 2,
        name: "Baccarat Rouge 540",
        brand: "MAISON FRANCIS KURKDJIAN",
        price: 8900,
        category: "unisex",
        description: "Вишуканий аромат із бурштиновими нотами.",
        image: "images/perfume-02.jpg"
    },
    {
        id: 3,
        name: "Another 13",
        brand: "LE LABO",
        price: 7500,
        category: "unisex",
        description: "Мінімалістична композиція з характером.",
        image: "images/perfume-03.jpg"
    },
    {
        id: 4,
        name: "Oud Wood",
        brand: "TOM FORD",
        price: 8100,
        category: "men",
        description: "Теплий деревний аромат із нотами уда.",
        image: "images/perfume-04.jpg"
    }
];


/* CART AND FAVORITES */

let cart = JSON.parse(localStorage.getItem("noirCart")) || [];
let favorites = JSON.parse(localStorage.getItem("noirFavorites")) || [];

const productGrid = document.getElementById("productGrid");


/* PRICE FORMAT */

function formatPrice(price) {
    return new Intl.NumberFormat("uk-UA").format(price) + " ₴";
}


/* RENDER PRODUCTS */

function renderProducts(items = products) {
    if (!productGrid) return;

    if (items.length === 0) {
        productGrid.innerHTML = `
            <p class="empty-message">Ароматів не знайдено.</p>
        `;
        return;
    }

    productGrid.innerHTML = items.map(product => `
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
                    class="favorite-button ${favorites.includes(product.id) ? "active" : ""}"
                    data-favorite="${product.id}"
                    aria-label="Додати в обране"
                >
                    ${favorites.includes(product.id) ? "♥" : "♡"}
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


/* FAVORITES */

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem(
        "noirFavorites",
        JSON.stringify(favorites)
    );

    // Зберігаємо поточний пошуковий запит
    const searchInput = document.getElementById("searchInput");

    if (searchInput && searchInput.value.trim()) {
        searchProducts(searchInput.value);
    } else {
        renderProducts();
    }
}


/* ADD TO CART */

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} додано до кошика`);
}


/* REMOVE FROM CART */

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}


/* CHANGE QUANTITY */

function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity = (item.quantity || 1) + change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}


/* UPDATE CART */

function updateCart() {
    localStorage.setItem(
        "noirCart",
        JSON.stringify(cart)
    );

    const cartCount = cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
    );

    const cartElement = document.getElementById("cartCount");

    if (cartElement) {
        cartElement.textContent = cartCount;
    }

    renderCart();
}


/* RENDER CART */

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Ваш кошик поки порожній.</p>";
        cartTotal.textContent = "0 ₴";

        if (cartCount) {
            cartCount.textContent = "0";
        }

        return;
    }

    let total = 0;
    let count = 0;

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        const quantity = item.quantity || 1;

        total += product.price * quantity;
        count += quantity;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p>${formatPrice(product.price)}</p>

                    <div class="cart-quantity">
                        <button
                            data-quantity="${product.id}"
                            data-change="-1"
                        >−</button>

                        <span>${quantity}</span>

                        <button
                            data-quantity="${product.id}"
                            data-change="1"
                        >+</button>
                    </div>
                </div>

                <button
                    class="cart-remove"
                    data-remove="${product.id}"
                >
                    Видалити
                </button>
            </div>
        `;
    }).join("");

    cartTotal.textContent = formatPrice(total);

    if (cartCount) {
        cartCount.textContent = count;
    }
}


/* NOTIFICATIONS */

function showNotification(message) {
    const notification = document.createElement("div");

    notification.className = "notification";
    notification.textContent = message;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    setTimeout(() => {
        notification.classList.remove("show");

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}


/* FILTER PRODUCTS */

function filterProducts(category) {
    if (category === "all") {
        renderProducts(products);
        return;
    }

    const filtered = products.filter(
        product => product.category === category
    );

    renderProducts(filtered);
}


/* SEARCH PRODUCTS */

function searchProducts(query) {
    const normalizedQuery = query.toLowerCase().trim();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.brand.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery)
    );

    renderProducts(filtered);
}


/* CLICK EVENTS */

document.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-favorite]");
    const cartButton = event.target.closest("[data-cart]");
    const removeButton = event.target.closest("[data-remove]");
    const quantityButton = event.target.closest("[data-quantity]");

    if (favoriteButton) {
        toggleFavorite(Number(favoriteButton.dataset.favorite));
        return;
    }

    if (cartButton) {
        addToCart(Number(cartButton.dataset.cart));
        return;
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
        return;
    }

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );
    }
});


/* CART OPEN / CLOSE */

document.addEventListener("DOMContentLoaded", () => {
    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");
    const cartOverlay = document.getElementById("cartOverlay");

    if (openCart && cartOverlay) {
        openCart.addEventListener("click", () => {
            cartOverlay.classList.add("active");
        });
    }

    if (closeCart && cartOverlay) {
        closeCart.addEventListener("click", () => {
            cartOverlay.classList.remove("active");
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener("click", event => {
            if (event.target === cartOverlay) {
                cartOverlay.classList.remove("active");
            }
        });
    }

    // Показуємо товари
    renderProducts();

    // Підключаємо пошук
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchProducts(searchInput.value);
        });
    }

    // Оновлюємо кошик
    updateCart();

    console.log("NOIR website is ready.");
});
