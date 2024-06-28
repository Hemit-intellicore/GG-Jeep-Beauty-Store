function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const address = prompt('Please enter your shipping address:');
  const phoneNumber = prompt('Please enter your phone number:');

  if (!address || !phoneNumber) {
    alert('Address and phone number are required.');
    return;
  }

  let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const order = {
    id: Date.now(),
    items: cart,
    address: address,
    phoneNumber: phoneNumber,
    totalAmount: totalAmount
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Proceed with payment
  payWithPaystack(totalAmount);
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


document.addEventListener('DOMContentLoaded', () => {
  const password = prompt('Enter the admin password:');
  const adminPassword = 'password'; // Set your admin password here

  if (password !== adminPassword) {
    alert('Incorrect password.');
    window.location.href = 'index.html'; // Redirect to the home page or another page
    return;
  }

  const orderListContainer = document.getElementById('order-list');
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (orders.length === 0) {
    orderListContainer.innerHTML = '<p>No orders have been made.</p>';
    return;
  }

  orders.forEach(order => {
    const orderItem = document.createElement('div');
    orderItem.className = 'list-group-item';
    orderItem.innerHTML = `
      <h5>Order ID: ${order.id}</h5>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
      <p><strong>Total Amount:</strong> ₦${order.totalAmount.toFixed(2)}</p>
      <ul>
        ${order.items.map(item => `<li>${item.name} - ₦${item.price.toFixed(2)} x ${item.quantity}</li>`).join('')}
      </ul>
    `;
    orderListContainer.appendChild(orderItem);
  });
});