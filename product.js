const productNotes = {
  1: {
    notes: ["Чорна орхідея", "Трюфель", "Пачулі", "Ваніль"],
    volume: "50 мл",
    concentration: "Eau de Parfum"
  },

  2: {
    notes: ["Шафран", "Жасмин", "Амбра", "Кедр"],
    volume: "70 мл",
    concentration: "Eau de Parfum"
  },

  3: {
    notes: ["Мускус", "Амброкс", "Жасмин"],
    volume: "50 мл",
    concentration: "Eau de Parfum"
  },

  4: {
    notes: ["Уд", "Сандал", "Кардамон", "Ваніль"],
    volume: "50 мл",
    concentration: "Eau de Parfum"
  }
};


document.addEventListener("DOMContentLoaded", () => {

  const productContainer = document.getElementById("productDetails");

  if (!productContainer) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  const product = products.find(item => item.id === productId);

  if (!product) {
    productContainer.innerHTML = `
      <div class="product-not-found">
        <h2>Аромат не знайдено</h2>
        <a href="index.html#collection">
          Повернутися до колекції
        </a>
      </div>
    `;

    return;
  }

  const extra = productNotes[product.id];

  document.title = `${product.name} — NOIR`;

  productContainer.innerHTML = `
    <div class="detail-image-wrapper">
      <img
        src="${product.image}"
        alt="${product.name}"
        class="detail-image"
      >
    </div>

    <div class="detail-info">

      <p class="detail-brand">${product.brand}</p>

      <h1 class="detail-name">${product.name}</h1>

      <p class="detail-description">
        ${product.description}
      </p>

      <p class="detail-price">
        ${formatPrice(product.price)}
      </p>

      <hr class="detail-divider">

      <h2 class="detail-notes-title">
        Ноти аромату
      </h2>

      <div class="detail-notes">
        ${extra.notes.map(note => `
          <span class="detail-note">${note}</span>
        `).join("")}
      </div>

      <p class="detail-volume">
        Об'єм: ${extra.volume}<br>
        Концентрація: ${extra.concentration}
      </p>

      <button class="detail-add-button" id="detailAddToCart">
        Додати до кошика
      </button>

    </div>
  `;

  // Додавання товару до кошика
  const addButton = document.getElementById("detailAddToCart");

  addButton.addEventListener("click", () => {
    addToCart(product.id);
  });

});