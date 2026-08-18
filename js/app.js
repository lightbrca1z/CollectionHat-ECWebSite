const CART_KEY = "collectionHatCart";

const PRODUCTS = {
  "felt-black": {
    id: "felt-black",
    name: "フェルトハット",
    price: 19000,
    image: "images/hat-black-1.png",
    images: [
      "images/hat-black-1.png",
      "images/hat-grey-1.png",
      "images/hat-navy-1.png",
      "images/hat-beige-1.png",
    ],
  },
  "felt-grey": {
    id: "felt-grey",
    name: "フェルトハット",
    price: 15000,
    image: "images/hat-grey-1.png",
    images: [
      "images/hat-grey-1.png",
      "images/hat-black-1.png",
      "images/hat-navy-1.png",
      "images/hat-beige-1.png",
    ],
  },
  "felt-navy": {
    id: "felt-navy",
    name: "フェルトハット",
    price: 18000,
    image: "images/hat-navy-1.png",
    images: [
      "images/hat-navy-1.png",
      "images/hat-black-1.png",
      "images/hat-grey-1.png",
      "images/hat-beige-1.png",
    ],
  },
  "felt-beige": {
    id: "felt-beige",
    name: "フェルトハット",
    price: 16000,
    image: "images/hat-beige-1.png",
    images: [
      "images/hat-beige-1.png",
      "images/hat-black-1.png",
      "images/hat-grey-1.png",
      "images/hat-navy-1.png",
    ],
  },
};

function formatPrice(n) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (_err) {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-show"), 1800);
}

function addToCart(payload) {
  const cart = getCart();
  const key = `${payload.id}|${payload.size}|${payload.color}`;
  const existing = cart.find((item) => item.key === key);
  if (existing) {
    existing.qty += payload.qty || 1;
  } else {
    cart.push({
      key,
      id: payload.id,
      name: payload.name,
      price: payload.price,
      image: payload.image,
      size: payload.size,
      color: payload.color,
      qty: payload.qty || 1,
    });
  }
  saveCart(cart);
  showToast("カートに追加しました");
}

function initMenu() {
  const btn = document.querySelector(".menu-btn");
  const drawer = document.querySelector(".nav-drawer");
  const overlay = document.querySelector(".nav-overlay");
  if (!btn || !drawer || !overlay) return;

  const close = () => {
    btn.classList.remove("is-open");
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const open = !drawer.classList.contains("is-open");
    btn.classList.toggle("is-open", open);
    drawer.classList.toggle("is-open", open);
    overlay.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });

  overlay.addEventListener("click", close);
}

function initGallery() {
  const main = document.querySelector("#gallery-main");
  const thumbs = document.querySelector(".thumbs");
  if (!main || !thumbs || thumbs.dataset.bound === "1") return;
  thumbs.dataset.bound = "1";

  thumbs.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-src]");
    if (!btn) return;
    main.src = btn.dataset.src;
    thumbs
      .querySelectorAll("button[data-src]")
      .forEach((b) => b.classList.toggle("is-active", b === btn));
  });
}

function initSwatches() {
  const swatches = document.querySelectorAll(".swatch");
  if (!swatches.length) return;
  swatches.forEach((btn) => {
    btn.addEventListener("click", () => {
      swatches.forEach((s) => s.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });
}

function initAddToCart() {
  const btn = document.querySelector("#btn-add-cart");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const productId = btn.dataset.productId || "felt-black";
    const product = PRODUCTS[productId];
    if (!product) return;

    const size = document.querySelector("#size")?.value || "L";
    const colorBtn = document.querySelector(".swatch.is-active");
    const color = colorBtn?.dataset.color || "ブラック";

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      qty: 1,
    });
  });
}

function initCarousel() {
  const track = document.querySelector(".related-track");
  const prev = document.querySelector(".carousel-btn.prev");
  const next = document.querySelector(".carousel-btn.next");
  if (!track || !prev || !next) return;

  const step = () => Math.max(track.clientWidth * 0.55, 120);

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });
  next.addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });
}

function renderCartPage() {
  const list = document.querySelector("#cart-list");
  const empty = document.querySelector("#cart-empty");
  const summary = document.querySelector("#cart-summary");
  const totalEl = document.querySelector("#cart-total");
  if (!list || !empty || !summary || !totalEl) return;

  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = "";
    empty.hidden = false;
    summary.hidden = true;
    return;
  }

  empty.hidden = true;
  summary.hidden = false;

  list.innerHTML = cart
    .map(
      (item) => `
      <article class="cart-item" data-key="${item.key}">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h3>${item.name}</h3>
          <p>${item.color} / ${item.size}</p>
          <p>${formatPrice(item.price)}</p>
          <div class="qty-control">
            <button type="button" data-action="dec" aria-label="減らす">−</button>
            <span>${item.qty}</span>
            <button type="button" data-action="inc" aria-label="増やす">＋</button>
          </div>
        </div>
        <button type="button" class="cart-remove" data-action="remove">削除</button>
      </article>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = formatPrice(total);

  list.querySelectorAll(".cart-item").forEach((row) => {
    row.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (!action) return;
      const key = row.dataset.key;
      let next = getCart();
      const item = next.find((x) => x.key === key);
      if (!item) return;

      if (action === "inc") item.qty += 1;
      if (action === "dec") item.qty = Math.max(1, item.qty - 1);
      if (action === "remove") next = next.filter((x) => x.key !== key);

      saveCart(next);
      renderCartPage();
    });
  });
}

function initCheckout() {
  const btn = document.querySelector("#btn-checkout");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!getCart().length) {
      showToast("カートが空です");
      return;
    }
    saveCart([]);
    renderCartPage();
    showToast("ご注文ありがとうございました");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initGallery();
  initSwatches();
  initAddToCart();
  initCarousel();
  renderCartPage();
  initCheckout();
});
