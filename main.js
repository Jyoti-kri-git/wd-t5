let skip = 0; 
const limit = 10;
let loading = false;
let products = [];


const fetchProducts = async () => {
  if (loading) return;
  loading = true;
  document.getElementById("loader").style.display = "block";

  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  const data = await res.json();
  products = [...products, ...data.products];
  renderProducts(products);
  skip += limit;
  loading = false;
  document.getElementById("loader").style.display = "none";
};


const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartBadge = document.getElementById("cartCountBadge");
if (cartBadge) cartBadge.textContent = cart.length;


const updateWishlistBadge = () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const badge = document.getElementById("wishlistCountBadge");
  if (badge) badge.textContent = wishlist.length;
};
updateWishlistBadge(); 


const renderProducts = (productData) => {
  const list = document.getElementById("productList");
  list.innerHTML = ""; 
  productData.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">$${product.price}</p>
          <div class="mt-auto d-flex justify-content-between">
            <button class="btn btn-primary" onclick="addToCart(${product.id}, this)">Add to Cart</button>
            <button class="btn btn-outline-danger" onclick="addToWishlist(${product.id}, this)">
              <i class="bi bi-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    list.appendChild(col);
  });
};


const addToCart = (id, button) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  button.textContent = "Added";
  button.disabled = true;
  button.classList.remove("btn-primary");
  button.classList.add("btn-success");
};


const addToWishlist = (id, button) => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const product = products.find(p => p.id === id);
  const exists = wishlist.some(p => p.id === id);
  if (!exists) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    button.innerHTML = `<i class="bi bi-heart-fill"></i>`;
    button.classList.remove("btn-outline-danger");
    button.classList.add("btn-danger");
    updateWishlistBadge();
  }
};


window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
    fetchProducts();
  }
});


document.getElementById("sortSelect").addEventListener("change", (e) => {
  const value = e.target.value;
  const sorted = [...products];
  if (value === "low") sorted.sort((a, b) => a.price - b.price);
  else if (value === "high") sorted.sort((a, b) => b.price - a.price);
  document.getElementById("productList").innerHTML = "";
  renderProducts(sorted);
});


document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(query));
  document.getElementById("productList").innerHTML = "";
  renderProducts(filtered);
});


fetchProducts();
