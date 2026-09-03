const API_URL = window.SHOPFRONT_API_URL;

const SWATCHES = ["var(--swatch-1)", "var(--swatch-2)", "var(--swatch-3)", "var(--swatch-4)", "var(--swatch-5)", "var(--swatch-6)"];

const CATEGORY_ICONS = {
  Bags: '<path d="M6 7h12l1 13H5L6 7Z"></path><path d="M9 7a3 3 0 0 1 6 0"></path>',
  Home: '<path d="M4 11 12 4l8 7"></path><path d="M6 10v9h12v-9"></path>',
  Tools: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z"></path>',
  Stationery: '<path d="M4 20h4L18 10a2.1 2.1 0 0 0-3-3L5 17v3Z"></path><path d="M13.5 6.5l3 3"></path>',
};
const DEFAULT_ICON = '<circle cx="12" cy="12" r="7"></circle>';

function categoryIcon(category) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${CATEGORY_ICONS[category] || DEFAULT_ICON}</svg>`;
}

function swatchFor(productId) {
  return SWATCHES[productId % SWATCHES.length];
}

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

let products = [];
let activeCategory = "All";
let cart = []; // [{product_id, name, price_cents, swatch, quantity}]

const filterRow = document.getElementById("filter-row");
const grid = document.getElementById("product-grid");
const errorBox = document.getElementById("error");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartOverlay = document.getElementById("cart-overlay");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const customerNameInput = document.getElementById("customer-name");
const checkoutBtn = document.getElementById("checkout-btn");

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.add("visible");
}
function clearError() {
  errorBox.textContent = "";
  errorBox.classList.remove("visible");
}

async function loadProducts() {
  clearError();
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error(`GET /products -> ${res.status}`);
    products = await res.json();
    renderFilters();
    renderGrid();
  } catch (err) {
    showError(`Could not load the catalog: ${err.message}`);
  }
}

function renderFilters() {
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  filterRow.innerHTML = categories
    .map((c) => `<button type="button" class="filter-chip${c === activeCategory ? " active" : ""}" data-category="${c}">${c}</button>`)
    .join("");
  filterRow.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const visible = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);
  grid.innerHTML = visible
    .map(
      (p, i) => `
    <div class="product-card" style="animation-delay:${Math.min(i, 8) * 30}ms">
      <div class="swatch-block" style="--swatch-color:${swatchFor(p.id)}">
        ${categoryIcon(p.category)}
        <img class="product-photo" src="images/${p.id}.jpg" alt="" loading="lazy"
             onerror="this.remove()" />
      </div>
      <p class="product-name">${escapeHtml(p.name)}</p>
      <p class="product-category">${escapeHtml(p.category)}</p>
      <div class="product-footer">
        <span class="product-price">${formatPrice(p.price_cents)}</span>
        <button type="button" class="add-btn" data-add="${p.id}" ${p.stock < 1 ? "disabled" : ""}>+</button>
      </div>
    </div>
  `
    )
    .join("");

  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((item) => item.product_id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product_id: productId, name: product.name, price_cents: product.price_cents, quantity: 1 });
  }
  renderCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.product_id !== productId);
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
  cartTotalEl.textContent = formatPrice(cartTotal());
  checkoutBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-line">
      <div class="cart-line-swatch" style="--swatch-color:${swatchFor(item.product_id)}"></div>
      <div class="cart-line-info">
        <div class="cart-line-name">${escapeHtml(item.name)} &times; ${item.quantity}</div>
        <div class="cart-line-price">${formatPrice(item.price_cents * item.quantity)}</div>
      </div>
      <button type="button" class="cart-line-remove" data-remove="${item.product_id}">Remove</button>
    </div>
  `
    )
    .join("");

  cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.remove)));
  });
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
}
function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
}

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", async () => {
  clearError();
  const customerName = customerNameInput.value.trim();
  if (!customerName) {
    showError("Add your name before placing the order.");
    return;
  }
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Placing order...";
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customerName,
        items: cart.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `POST /orders -> ${res.status}`);
    showConfirmation(data);
    cart = [];
    customerNameInput.value = "";
    await loadProducts();
  } catch (err) {
    showError(`Could not place that order: ${err.message}`);
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Place order";
  }
});

function showConfirmation(order) {
  cartItemsEl.innerHTML = `
    <div class="order-confirm">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
      <h3>Order #${order.id} placed</h3>
      <p>${formatPrice(order.total_cents)} &middot; thank you, ${escapeHtml(order.customer_name)}.</p>
    </div>
  `;
  cartTotalEl.textContent = formatPrice(0);
  cartCount.textContent = "0";
}

loadProducts();
renderCart();
