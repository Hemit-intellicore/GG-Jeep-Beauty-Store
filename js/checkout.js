// Assuming cart data is stored in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  updateOrderSummary();
  document.getElementById('checkout-form').addEventListener('submit', checkout);
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

function checkout(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const phoneNumber = document.getElementById('phoneNumber').value;

  let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const order = {
    id: Date.now(),
    items: cart,
    customer: {
      name: name,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
    },
    totalAmount: totalAmount,
    orderDate: new Date().toISOString()
  };

  // Proceed with payment
  payWithPaystack(totalAmount, order);
}

function payWithPaystack(amount, order) {
  var handler = PaystackPop.setup({
    key: 'your_public_key_here', // Replace with your Paystack public key
    email: order.customer.email,
    amount: amount * 100, // Amount in kobo
    currency: 'NGN',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a random reference number
    callback: function(response) {
      alert('Payment successful. Transaction ref is ' + response.reference);

      // Save order to Firestore
      saveOrderToFirestore(order);

      localStorage.removeItem('cart'); // Clear cart after successful payment
      window.location.href = 'index.html'; // Redirect to home or another page
    },
    onClose: function() {
      alert('Payment cancelled.');
    }
  });
  handler.openIframe();
}

function saveOrderToFirestore(order) {
  db.collection("orders").add(order)
  .then((docRef) => {
    console.log("Order submitted successfully! Document ID: " + docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
    alert("Failed to submit order.");
  });
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
