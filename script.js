const products = [
  { id: 1, name: 'Lipstick', price: 8000.00, image: 'https://via.placeholder.com/200' },
  { id: 2, name: 'Foundation', price: 15000.00, image: 'https://via.placeholder.com/200' },
  { id: 3, name: 'Eyeliner', price: 5000.00, image: 'https://via.placeholder.com/200' },
  { id: 4, name: 'Human Hair Wig', price: 50000.00, image: 'https://via.placeholder.com/200' },
  { id: 5, name: 'Mascara', price: 10000.00, image: 'https://via.placeholder.com/200' },
];

let cart = [];

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
            <button class="btn btn-primary" onclick="addToCart(${product.id})">View/Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    productsContainer.innerHTML += productCard;
  });

  updateCart();
});

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  $('#cartModal').modal('show'); // Show cart modal when item is added
}

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  let totalAmount = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    const cartItem = `
      <tr>
        <td>${item.name}</td>
        <td>₦${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>₦${itemTotal.toFixed(2)}</td>
      </tr>
    `;
    cartItemsContainer.innerHTML += cartItem;
  });
  document.getElementById('total-amount').innerText = `₦${totalAmount.toFixed(2)}`;
  document.getElementById('cart-count').innerText = cart.length;
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
  } else {
    alert('Proceeding to payment...');
    // Implement payment logic here
    cart = [];
    updateCart();
    $('#cartModal').modal('hide'); // Hide cart modal after checkout
  }
}
