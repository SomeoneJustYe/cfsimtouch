/* ─── DATA ───────────────────────────────────────────────────────── */
const BOOKS = [
  { id: 1,  title: "The Midnight Library",   author: "Matt Haig",         price: 14.99, genre: "fiction",     emoji: "🌙", color: ["#1a2744","#2d4a8a"], rating: 5, badge: "Bestseller" },
  { id: 2,  title: "Atomic Habits",          author: "James Clear",       price: 16.99, genre: "non-fiction", emoji: "⚛️",  color: ["#1c3a2a","#2e6b4a"], rating: 5, badge: "Top Pick" },
  { id: 3,  title: "The Song of Achilles",   author: "Madeline Miller",   price: 13.99, genre: "romance",     emoji: "🏛️",  color: ["#4a1c2a","#8a3050"], rating: 5, badge: "Award Winner" },
  { id: 4,  title: "Dune",                   author: "Frank Herbert",     price: 18.99, genre: "sci-fi",      emoji: "🏜️",  color: ["#3a2c1a","#7a5c30"], rating: 5, badge: "Classic" },
  { id: 5,  title: "Lessons in Chemistry",   author: "Bonnie Garmus",     price: 15.99, genre: "fiction",     emoji: "🧪", color: ["#1a3a3a","#2e6b6b"], rating: 4, badge: null },
  { id: 6,  title: "Sapiens",               author: "Yuval Noah Harari", price: 17.99, genre: "non-fiction", emoji: "🦴", color: ["#2a1a3a","#5a3080"], rating: 5, badge: "Bestseller" },
  { id: 7,  title: "Beach Read",             author: "Emily Henry",       price: 12.99, genre: "romance",     emoji: "🌊", color: ["#1a2c4a","#2e5580"], rating: 4, badge: null },
  { id: 8,  title: "Project Hail Mary",      author: "Andy Weir",         price: 16.99, genre: "sci-fi",      emoji: "🚀", color: ["#0d0d2a","#1a1a5a"], rating: 5, badge: "Staff Pick" },
  { id: 9,  title: "Normal People",          author: "Sally Rooney",      price: 13.99, genre: "fiction",     emoji: "💬", color: ["#2a2a2a","#555555"], rating: 4, badge: null },
  { id: 10, title: "Thinking, Fast & Slow",  author: "Daniel Kahneman",   price: 15.99, genre: "non-fiction", emoji: "🧠", color: ["#1a2a3a","#304a6a"], rating: 5, badge: null },
  { id: 11, title: "It Ends with Us",        author: "Colleen Hoover",    price: 12.99, genre: "romance",     emoji: "🌻", color: ["#3a2010","#7a4525"], rating: 4, badge: "Trending" },
  { id: 12, title: "The Hitchhiker's Guide", author: "Douglas Adams",     price: 11.99, genre: "sci-fi",      emoji: "🌌", color: ["#102a1a","#206040"], rating: 5, badge: "Classic" },
];
 
/* ─── STATE ──────────────────────────────────────────────────────── */
let cart = [];
let activeFilter = "all";
let searchQuery = "";
 
/* ─── DOM REFS ───────────────────────────────────────────────────── */
const booksGrid    = document.getElementById("booksGrid");
const cartBtn      = document.getElementById("cartBtn");
const closeCart    = document.getElementById("closeCart");
const cartDrawer   = document.getElementById("cartDrawer");
const cartOverlay  = document.getElementById("cartOverlay");
const cartItems    = document.getElementById("cartItems");
const cartCountEl  = document.getElementById("cartCount");
const cartTotalEl  = document.getElementById("cartTotal");
const searchInput  = document.getElementById("searchInput");
const toast        = document.getElementById("toast");
const filterLinks  = document.querySelectorAll(".nav__links a");
 
/* ─── RENDER BOOKS ───────────────────────────────────────────────── */
function renderBooks() {
  const filtered = BOOKS.filter(book => {
    const matchGenre  = activeFilter === "all" || book.genre === activeFilter;
    const matchSearch = book.title.toLowerCase().includes(searchQuery) ||
                        book.author.toLowerCase().includes(searchQuery);
    return matchGenre && matchSearch;
  });
 
  booksGrid.innerHTML = "";
 
  if (!filtered.length) {
    booksGrid.innerHTML = `<p class="no-results">No books found. Try a different search.</p>`;
    return;
  }
 
  filtered.forEach((book, i) => {
    const stars = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${i * 0.06}s`;
    card.innerHTML = `
      <div class="card__cover" style="background: linear-gradient(145deg, ${book.color[0]}, ${book.color[1]})">
        <div class="card__cover-bg">${book.emoji}</div>
        <span class="card__genre-tag">${book.genre}</span>
        ${book.badge ? `<span class="card__badge">${book.badge}</span>` : ""}
        <div class="card__title-overlay">${book.title}</div>
      </div>
      <div class="card__body">
        <p class="card__author">${book.author}</p>
        <div class="card__meta">
          <span class="card__price">$${book.price.toFixed(2)}</span>
          <span class="card__stars">${stars}</span>
        </div>
        <button class="card__add" data-id="${book.id}">+ Add to Bag</button>
      </div>
    `;
    booksGrid.appendChild(card);
  });
 
  // bind add-to-cart buttons
  booksGrid.querySelectorAll(".card__add").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}
 
/* ─── CART LOGIC ─────────────────────────────────────────────────── */
function addToCart(id) {
  const book = BOOKS.find(b => b.id === id);
  if (!book) return;
 
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...book, qty: 1 });
  }
 
  updateCartUI();
  showToast(`"${book.title}" added to bag ✓`);
}
 
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}
 
function updateCartUI() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
 
  // badge
  cartCountEl.textContent = totalQty;
  cartCountEl.classList.toggle("visible", totalQty > 0);
 
  // total
  cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
 
  // items list
  if (!cart.length) {
    cartItems.innerHTML = `<p class="cart-empty">Your bag is empty.</p>`;
    return;
  }
 
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span class="cart-item__emoji">${item.emoji}</span>
      <div class="cart-item__info">
        <div class="cart-item__title">${item.title} ${item.qty > 1 ? `×${item.qty}` : ""}</div>
        <div class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" title="Remove">✕</button>
    `;
    row.querySelector(".cart-item__remove").addEventListener("click", () => removeFromCart(item.id));
    cartItems.appendChild(row);
  });
}
 
/* ─── DRAWER OPEN / CLOSE ────────────────────────────────────────── */
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCartFn() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}
 
cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartFn);
cartOverlay.addEventListener("click", closeCartFn);
 
/* ─── TOAST ──────────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
 
/* ─── FILTERS ────────────────────────────────────────────────────── */
filterLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    filterLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    activeFilter = link.dataset.filter;
    renderBooks();
  });
});
 
/* ─── SEARCH ─────────────────────────────────────────────────────── */
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.toLowerCase().trim();
  renderBooks();
});
 
/* ─── INIT ───────────────────────────────────────────────────────── */
renderBooks();
 