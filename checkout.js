// Assuming cart data is stored in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  updateOrderSummary();
});

function updateOrderSummary() {
  const orderSummaryContainer = document.getElementById('order-summary');
  orderSummaryContainer.innerHTML = '';
  let totalAmount = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    const orderItem = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <h6>${item.name}</h6>
          <small>₦${item.price.toFixed(2)} x ${item.quantity}</small>
        </div>
        <span>₦${itemTotal.toFixed(2)}</span>
      </li>
    `;
    orderSummaryContainer.innerHTML += orderItem;
  });

  document.getElementById('total-amount').innerText = `₦${totalAmount.toFixed(2)}`;
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  updateOrderSummary(); // Update order summary when adding to cart
  localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  updateOrderSummary(); // Update order summary when removing from cart
  localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
}

function payWithPaystack() {
  let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  var handler = PaystackPop.setup({
    key: 'your_public_key_here', // Replace with your Paystack public key
    email: 'customer@example.com',
    amount: totalAmount * 100, // Amount in kobo
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
