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
