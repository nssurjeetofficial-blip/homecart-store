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
// DEMO PRODUCTS (FALLBACK)
// ===================================

const demoProducts = [
  {
    id: 1,
    name: "Himalayan Pink Rock Salt",
    category: "salt",
    price: 149,
    oldPrice: 199,
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Himalayan Salt Lamp",
    category: "salt",
    price: 599,
    oldPrice: 799,
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Natural Rock Salt",
    category: "salt",
    price: 99,
    oldPrice: 149,
    rating: "★★★★☆",
    image: "https://images.unsplash.com/photo-1606851091851-e8c8c0fca7a3?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Premium Indian Masala",
    category: "spices",
    price: 129,
    oldPrice: 169,
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    name: "Red Chilli Powder",
    category: "spices",
    price: 89,
    oldPrice: 119,
    rating: "★★★★☆",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    name: "Premium Dry Fruits Mix",
    category: "dry fruits",
    price: 349,
    oldPrice: 429,
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    name: "Fresh Natural Herbs",
    category: "herbs",
    price: 119,
    oldPrice: 159,
    rating: "★★★★☆",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    name: "Chocolate & Sweet Treats",
    category: "snacks",
    price: 199,
    oldPrice: 249,
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


// ===================================
// HELPER FUNCTIONS
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

      console.log("HOMECART: Database products loaded.");

    } else {

      products = [...demoProducts];

      console.log("No database products found. Demo products loaded.");

    }

  } catch (error) {

    console.error("Supabase Error:", error.message);

    products = [...demoProducts];

  }

  displayProducts();
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

    const isLiked = wishlist.includes(product.id);

    return `
      <div class="product">

        <div class="product-img">

          <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
          >

          <button
            class="heart ${isLiked ? "selected" : ""}"
            onclick='toggleWishlist(${JSON.stringify(product.id)})'
            aria-label="Add to wishlist"
          >
            ${isLiked ? "♥" : "♡"}
          </button>

        </div>

        <div class="product-info">

          <span class="product-category">
            ${escapeHTML(product.category)}
          </span>

          <h3>${escapeHTML(product.name)}</h3>

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

  if (currentCategory === "all") {

    displayProducts(products);

  } else {

    const filtered = products.filter(product =>
      product.category === currentCategory
    );

    displayProducts(filtered);

  }

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

  const filtered = products.filter(product => {

    return (
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );

  });

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
// SEARCH ENTER BUTTON
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

        <p>
          ₹${item.price} × ${item.quantity}
        </p>

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
// REFRESH CURRENT PRODUCT VIEW
// ===================================

function displayCurrentProducts() {

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
// INITIALIZE WEBSITE
// ===================================

updateCart();

loadProducts();
