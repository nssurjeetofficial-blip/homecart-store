// ===================================
// HOMECART - SUPABASE CONFIGURATION
// ===================================

const SUPABASE_URL = "https://biieypsncywqtkougaow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_IzYP74KE3WMegQ0QnMMaag_aCG7MqV_";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ===================================
// DEMO PRODUCTS
// ===================================

const demoProducts = [
  {
    id: 1,
    name: "Himalayan Pink Rock Salt",
    category: "salt",
    price: 149,
    oldPrice: 199,
    description: "Natural Himalayan Pink Rock Salt.",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Himalayan Salt Lamp",
    category: "salt",
    price: 599,
    oldPrice: 799,
    description: "Beautiful Himalayan Salt Lamp.",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Natural Rock Salt",
    category: "salt",
    price: 99,
    oldPrice: 149,
    description: "Natural Rock Salt.",
    rating: "★★★★☆",
    image: "https://images.unsplash.com/photo-1606851091851-e8c8c0fca7a3?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Premium Indian Masala",
    category: "spices",
    price: 129,
    oldPrice: 169,
    description: "Premium Indian Masala.",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    name: "Red Chilli Powder",
    category: "spices",
    price: 89,
    oldPrice: 119,
    description: "Fresh Red Chilli Powder.",
    rating: "★★★★☆",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    name: "Premium Dry Fruits Mix",
    category: "dry fruits",
    price: 349,
    oldPrice: 429,
    description: "Premium quality dry fruits mix.",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    name: "Fresh Natural Herbs",
    category: "herbs",
    price: 119,
    oldPrice: 159,
    description: "Fresh natural herbs.",
    rating: "★★★★☆",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    name: "Chocolate & Sweet Treats",
    category: "snacks",
    price: 199,
    oldPrice: 249,
    description: "Chocolate and sweet treats.",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1621939514649-280e2aaae4b6?auto=format&fit=crop&w=500&q=80"
  }
];

let products = [...demoProducts];


// ===================================
// STORAGE
// ===================================

let cart = JSON.parse(localStorage.getItem("homecart_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("homecart_wishlist")) || [];

let currentCategory = "all";
let detailQuantity = 1;


// ===================================
// HELPER
// ===================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}


// ===================================
// PRODUCT DETAIL CSS
// ===================================

function addDetailStyles() {

  if (document.getElementById("homecart-detail-styles")) return;

  const style = document.createElement("style");

  style.id = "homecart-detail-styles";

  style.textContent = `
    .hc-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 35px;
      background: white;
      padding: 25px;
      border-radius: 16px;
      margin: 20px 0;
    }

    .hc-detail-image {
      width: 100%;
      height: 380px;
      object-fit: contain;
      background: #f7f7f7;
      border-radius: 12px;
    }

    .hc-detail-info h2 {
      font-size: 27px;
      margin: 12px 0;
    }

    .hc-detail-price {
      font-size: 27px;
      font-weight: 800;
      color: #e87922;
      margin: 15px 0;
    }

    .hc-detail-old {
      font-size: 16px;
      color: #999;
      text-decoration: line-through;
      margin-left: 8px;
    }

    .hc-detail-description {
      color: #666;
      line-height: 1.7;
      margin: 18px 0;
    }

    .hc-quantity {
      display: flex;
      align-items: center;
      gap: 15px;
      margin: 20px 0;
    }

    .hc-quantity button {
      width: 38px;
      height: 38px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      font-size: 20px;
      cursor: pointer;
    }

    .hc-quantity span {
      font-size: 18px;
      font-weight: bold;
    }

    .hc-detail-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    .hc-detail-actions button {
      flex: 1;
      min-width: 130px;
      padding: 14px;
      border: none;
      border-radius: 9px;
      font-weight: bold;
      cursor: pointer;
    }

    .hc-buy {
      background: #e87922;
      color: white;
    }

    .hc-add {
      background: #123d2b;
      color: white;
    }

    .hc-back {
      border: none;
      background: transparent;
      color: #123d2b;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      padding: 12px 0;
    }

    .hc-delivery {
      background: #f4f8f4;
      padding: 14px;
      border-radius: 10px;
      margin-top: 20px;
      color: #345;
    }

    @media(max-width:650px) {
      .hc-detail {
        grid-template-columns: 1fr;
        padding: 15px;
        gap: 20px;
      }

      .hc-detail-image {
        height: 270px;
      }

      .hc-detail-info h2 {
        font-size: 22px;
      }
    }
  `;

  document.head.appendChild(style);
}


// ===================================
// LOAD PRODUCTS FROM SUPABASE
// ===================================

async function loadProducts() {

  const grid = document.getElementById("productGrid");

  if (grid) {
    grid.innerHTML = "<p>Loading products...</p>";
  }

  try {

    const { data, error } = await supabaseClient
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
        categories(name)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {

      products = data.map(product => {

        const categoryData = Array.isArray(product.categories)
          ? product.categories[0]
          : product.categories;

        return {
          id: product.id,
          name: product.name,
          description: product.description || "",
          category: categoryData?.name?.toLowerCase() || "other",
          price: Number(product.price),
          oldPrice: Number(product.price),
          rating: "★★★★★",
          image: product.image_url || "",
          stock: product.stock
        };

      });

    } else {

      products = [...demoProducts];

    }

  } catch (error) {

    console.error("Supabase Error:", error.message);

    products = [...demoProducts];

  }

  displayCurrentRoute();
}


// ===================================
// SAVE DATA
// ===================================

function saveCart() {
  localStorage.setItem("homecart_cart", JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem("homecart_wishlist", JSON.stringify(wishlist));
}


// ===================================
// DISPLAY PRODUCTS
// ===================================

function displayProducts(list = products) {

  const grid = document.getElementById("productGrid");

  if (!grid) return;

  if (list.length === 0) {

    grid.innerHTML = `
      <div class="no-products">
        <h3>No products found</h3>
        <p>Try searching for another product.</p>
      </div>
    `;

    return;
  }

  grid.innerHTML = list.map(product => {

    const isLiked = wishlist.some(id =>
      String(id) === String(product.id)
    );

    return `
      <div class="product">

        <div class="product-img"
             onclick='openProduct(${JSON.stringify(String(product.id))})'
             style="cursor:pointer">

          <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
          >

          <button
            class="heart ${isLiked ? "selected" : ""}"
            onclick='event.stopPropagation(); toggleWishlist(${JSON.stringify(product.id)})'
            aria-label="Add to wishlist"
          >
            ${isLiked ? "♥" : "♡"}
          </button>

        </div>

        <div class="product-info">

          <span class="product-category">
            ${escapeHTML(product.category)}
          </span>

          <h3
            onclick='openProduct(${JSON.stringify(String(product.id))})'
            style="cursor:pointer"
          >
            ${escapeHTML(product.name)}
          </h3>

          <div class="rating">
            ${product.rating}
          </div>

          <div class="price">
            ₹${product.price}
            <small>₹${product.oldPrice}</small>
          </div>

          <button
            class="add-btn"
            onclick='addToCart(${JSON.stringify(product.id)})'
          >
            ADD TO CART
          </button>

        </div>

      </div>
    `;

  }).join("");

}


// ===================================
// OPEN PRODUCT DETAILS
// ===================================

function openProduct(productId) {

  const product = products.find(item =>
    String(item.id) === String(productId)
  );

  if (!product) return;

  const url = new URL(window.location.href);

  url.searchParams.set("product", productId);

  history.pushState({}, "", url);

  detailQuantity = 1;

  renderProductDetails(product);

}


// ===================================
// PRODUCT DETAILS PAGE
// ===================================

function renderProductDetails(product) {

  const grid = document.getElementById("productGrid");

  if (!grid) return;

  addDetailStyles();

  const image = product.image ||
    "https://placehold.co/500x500?text=HOMECART";

  grid.innerHTML = `

    <button class="hc-back" onclick="closeProductDetails()">
      ← Back to Products
    </button>

    <div class="hc-detail">

      <div>
        <img
          class="hc-detail-image"
          src="${escapeHTML(image)}"
          alt="${escapeHTML(product.name)}"
        >
      </div>

      <div class="hc-detail-info">

        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <h2>${escapeHTML(product.name)}</h2>

        <div class="rating">
          ${product.rating}
        </div>

        <div class="hc-detail-price">
          ₹${product.price}

          <span class="hc-detail-old">
            ₹${product.oldPrice}
          </span>
        </div>

        <p class="hc-detail-description">
          ${escapeHTML(product.description || "Quality products from HOMECART.")}
        </p>

        <p>
          ${product.stock > 0 || product.stock === undefined
            ? "🟢 Available"
            : "🔴 Out of Stock"}
        </p>

        <div class="hc-quantity">

          <strong>Quantity:</strong>

          <button onclick="changeDetailQuantity(-1)">−</button>

          <span id="detailQuantity">1</span>

          <button onclick="changeDetailQuantity(1)">+</button>

        </div>

        <div class="hc-detail-actions">

          <button
            class="hc-add"
            onclick='addDetailToCart(${JSON.stringify(String(product.id))})'
          >
            🛒 ADD TO CART
          </button>

          <button
            class="hc-buy"
            onclick='buyNow(${JSON.stringify(String(product.id))})'
          >
            BUY NOW
          </button>

        </div>

        <div class="hc-delivery">
          🚚 Delivery information<br>
          Delivery charges will be calculated during checkout.
        </div>

      </div>

    </div>

  `;

  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth"
  });

}


// ===================================
// CHANGE PRODUCT QUANTITY
// ===================================

function changeDetailQuantity(change) {

  detailQuantity = Math.max(1, detailQuantity + change);

  const quantity = document.getElementById("detailQuantity");

  if (quantity) {
    quantity.textContent = detailQuantity;
  }

}


// ===================================
// ADD DETAIL PRODUCT TO CART
// ===================================

function addDetailToCart(productId) {

  const product = products.find(item =>
    String(item.id) === String(productId)
  );

  if (!product) return;

  for (let i = 0; i < detailQuantity; i++) {
    addToCart(product.id);
  }

}


// ===================================
// BUY NOW
// ===================================

function buyNow(productId) {

  addDetailToCart(productId);

  toggleCart();

}


// ===================================
// CLOSE PRODUCT DETAILS
// ===================================

function closeProductDetails() {

  const url = new URL(window.location.href);

  url.searchParams.delete("product");

  history.pushState({}, "", url);

  displayCurrentProducts();

}


// ===================================
// ROUTE HANDLING
// ===================================

function displayCurrentRoute() {

  const params = new URLSearchParams(window.location.search);

  const productId = params.get("product");

  if (productId) {

    const product = products.find(item =>
      String(item.id) === String(productId)
    );

    if (product) {
      renderProductDetails(product);
      return;
    }

  }

  displayCurrentProducts();

}

window.addEventListener("popstate", displayCurrentRoute);


// ===================================
// FILTER PRODUCTS
// ===================================

function filterCategory(category, button) {

  currentCategory = category.toLowerCase();

  document.querySelectorAll(".filter").forEach(item => {
    item.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }

  displayCurrentProducts();

  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth"
  });

}


// ===================================
// SEARCH PRODUCTS
// ===================================

function searchProducts() {

  const input = document.getElementById("searchInput");

  if (!input) return;

  const search = input.value.trim().toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search) ||
    product.category.toLowerCase().includes(search)
  );

  currentCategory = "search";

  document.querySelectorAll(".filter").forEach(button => {
    button.classList.remove("active");
  });

  displayProducts(filtered);

  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth"
  });

}


// ===================================
// SEARCH ENTER
// ===================================

document.getElementById("searchInput")?.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {
      searchProducts();
    }

  }
);


// ===================================
// ADD TO CART
// ===================================

function addToCart(productId) {

  const product = products.find(item =>
    String(item.id) === String(productId)
  );

  if (!product) return;

  const existing = cart.find(item =>
    String(item.id) === String(productId)
  );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  saveCart();

  updateCart();

  alert(product.name + " added to cart!");

}


// ===================================
// UPDATE CART
// ===================================

function updateCart() {

  const cartItems = document.getElementById("cartItems");

  const cartCount = document.getElementById("cartCount");

  const cartTotal = document.getElementById("cartTotal");

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {

    totalItems += item.quantity;

    totalPrice += item.price * item.quantity;

  });

  if (cartCount) cartCount.textContent = totalItems;

  if (cartTotal) cartTotal.textContent = "₹" + totalPrice;

  if (!cartItems) return;

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty">
        Your cart is empty.
      </div>
    `;

    return;

  }

  cartItems.innerHTML = cart.map(item => `

    <div class="cart-item">

      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">

      <div class="cart-item-info">

        <strong>${escapeHTML(item.name)}</strong>

        <p>₹${item.price} × ${item.quantity}</p>

        <button
          class="remove"
          onclick='removeFromCart(${JSON.stringify(item.id)})'
        >
          Remove
        </button>

      </div>

    </div>

  `).join("");

}


// ===================================
// REMOVE FROM CART
// ===================================

function removeFromCart(productId) {

  cart = cart.filter(item =>
    String(item.id) !== String(productId)
  );

  saveCart();

  updateCart();

}


// ===================================
// OPEN / CLOSE CART
// ===================================

function toggleCart() {

  document.getElementById("cartPanel")?.classList.toggle("open");

}


// ===================================
// WISHLIST
// ===================================

function toggleWishlist(productId) {

  const exists = wishlist.some(id =>
    String(id) === String(productId)
  );

  if (exists) {

    wishlist = wishlist.filter(id =>
      String(id) !== String(productId)
    );

  } else {

    wishlist.push(productId);

  }

  saveWishlist();

  displayCurrentProducts();

}


// ===================================
// REFRESH CURRENT VIEW
// ===================================

function displayCurrentProducts() {

  const params = new URLSearchParams(window.location.search);

  if (params.has("product")) return;

  let filtered = products;

  if (currentCategory === "search") {

    const search = document.getElementById("searchInput")?.value
      .trim()
      .toLowerCase() || "";

    filtered = products.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );

  } else if (currentCategory !== "all") {

    filtered = products.filter(product =>
      product.category === currentCategory
    );

  }

  displayProducts(filtered);

}


// ===================================
// SHOW WISHLIST
// ===================================

function showWishlist() {

  const favoriteProducts = products.filter(product =>
    wishlist.some(id => String(id) === String(product.id))
  );

  currentCategory = "wishlist";

  displayProducts(favoriteProducts);

  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth"
  });

}


// ===================================
// CHECKOUT PLACEHOLDER
// ===================================

function checkout() {

  if (cart.length === 0) {

    alert("Your cart is empty!");

    return;

  }

  alert(
    "Checkout system will be connected in the next development stage."
  );

}


// ===================================
// CUSTOMER SUPPORT
// ===================================

function contactSupport() {

  const phoneNumber = "919555701386";

  const message = encodeURIComponent(
    "Hello MR AMIT JI I NEED YOU BECAUSE YOUR WEBSITE IS MAKE SOME ERROR‼️"
  );

  window.open(
    "https://wa.me/" + phoneNumber + "?text=" + message,
    "_blank"
  );

}


// ===================================
// INITIALIZE
// ===================================

updateCart();

loadProducts();
