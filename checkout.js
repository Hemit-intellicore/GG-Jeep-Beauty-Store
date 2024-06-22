const products = [
  { id: 1, name: 'Lipstick', price: 8000.00, image: 'https://via.placeholder.com/200' },
  { id: 2, name: 'Foundation', price: 15000.00, image: 'https://via.placeholder.com/200' },
  { id: 3, name: 'Eyeliner', price: 5000.00, image: 'https://via.placeholder.com/200' },
  { id: 4, name: 'Human Hair Wig', price: 50000.00, image: 'https://via.placeholder.com/200' },
  { id: 5, name: 'Mascara', price: 10000.00, image: 'https://via.placeholder.com/200' },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products');
  products.forEach(product => {
    const productCard = `
      <div class="col-md-4">
        <div class="card mb-4">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">₦${product.price.toFixed(2)}</p>
            <button class="btn btn-outline-dark" onclick="viewProduct(${product.id})">View Product</button>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    productsContainer.innerHTML += productCard;
  });

  updateCart();
});

function viewProduct(productId) {
  const product = products.find(p => p.id === productId);
  alert(`Product: ${product.name}\nPrice: ₦${product.price.toFixed(2)}\nDescription: This is a great product.`);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  let totalAmount = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    const cartItem = `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h5>${item.name}</h5>
          <p>₦${item.price.toFixed(2)} x ${item.quantity} = ₦${itemTotal.toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.innerHTML += cartItem;
  });
  document.getElementById('total-amount').innerText = `₦${totalAmount.toFixed(2)}`;
  document.getElementById('cart-count').innerText = cart.length;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
  } else {
    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    payWithPaystack(totalAmount);
  }
}

function payWithPaystack(amount) {
  var handler = PaystackPop.setup({
    key: 'your_public_key_here', // Replace with your public key
    email: 'customer@example.com',
    amount: amount * 100, // Amount in kobo
    currency: 'NGN',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a random reference number
    callback: function(response) {
      alert('Payment successful. Transaction ref is ' + response.reference);
      localStorage.removeItem('cart'); // Clear cart after successful payment
      window.location.href = 'index.html'; // Redirect to home or another page
    },
    onClose: function() {
      alert('Payment cancelled.');
    }
  });
  handler.openIframe();
}
