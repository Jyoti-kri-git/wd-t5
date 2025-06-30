const wishlistKey = 'wishlist'; 

const readWishlist = () => JSON.parse(localStorage.getItem(wishlistKey) || '[]');
const writeWishlist = (items) => localStorage.setItem(wishlistKey, JSON.stringify(items));

const readCart = () => JSON.parse(localStorage.getItem("cart") || '[]');
const writeCart = (items) => localStorage.setItem("cart", JSON.stringify(items));

const updateWishlistBadge = () => {
  const wishlist = readWishlist();
  const badge = document.getElementById('wishlistCountBadge');
  if (badge) badge.textContent = wishlist.length;
};

const updateCartBadge = () => {
  const cart = readCart();
  const badge = document.getElementById('cartCountBadge');
  if (badge) badge.textContent = cart.length;
};

function displayWishlist() {
  const wishlist = readWishlist();
  const wishlistContainer = document.getElementById('wishlistItems');
  const emptyMsg = document.getElementById('wishlistEmpty');

  if (wishlist.length === 0) {
    emptyMsg.style.display = 'block';
    wishlistContainer.innerHTML = '';
    updateWishlistBadge();
    return;
  }

  emptyMsg.style.display = 'none';
  wishlistContainer.innerHTML = wishlist.map(product => `
    <div class="col-md-4">
      <div class="card h-100">
        <img src="${product.image || product.thumbnail}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">₹${product.price}</p>
          <div class="mt-auto d-flex justify-content-between">
            <button class="btn btn-danger" onclick="removeFromWishlist(${product.id})">Remove</button>
            <button class="btn btn-success" onclick="moveToCart(${product.id})">Move to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  updateWishlistBadge();
}

function removeFromWishlist(id) {
  let wishlist = readWishlist();
  wishlist = wishlist.filter(item => item.id !== id);
  writeWishlist(wishlist);
  displayWishlist();
}

function moveToCart(id) {
  let wishlist = readWishlist();
  const product = wishlist.find(item => item.id === id);
  if (!product) return;

  let cart = readCart();

  
  if (!cart.some(item => item.id === id)) {
    cart.push(product);
    writeCart(cart);
  }

  
  wishlist = wishlist.filter(item => item.id !== id);
  writeWishlist(wishlist);

  displayWishlist();
  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', () => {
  displayWishlist();
  updateWishlistBadge();
  updateCartBadge();
});

function clearWishlist() {
  if (confirm("Are you sure you want to clear your entire wishlist?")) {
    localStorage.removeItem(wishlistKey);
    displayWishlist();
    updateWishlistBadge();
  }
}
