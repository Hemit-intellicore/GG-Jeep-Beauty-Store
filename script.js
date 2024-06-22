// Define an array of products with details including ID, name, price, and image URL
const products = [
  { id: 1, name: 'Lipstick', price: 8000.00, image: 'https://via.placeholder.com/200' },
  { id: 2, name: 'Foundation', price: 15000.00, image: 'https://via.placeholder.com/200' },
  { id: 3, name: 'Eyeliner', price: 5000.00, image: 'https://via.placeholder.com/200' },
  { id: 4, name: 'Human Hair Wig', price: 50000.00, image: 'https://via.placeholder.com/200' },
  { id: 5, name: 'Mascara', price: 10000.00, image: 'https://via.placeholder.com/200' },
];

// Initialize an empty cart array to store items added to the cart
let cart = [];

// Wait for the DOM content to load before executing JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Get the products container element
  const productsContainer = document.getElementById('products');

  // Loop through each product and generate HTML card for display
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
    // Append each product card HTML to the products container
    productsContainer.innerHTML += productCard;
  });

  // Update the cart display after rendering products
  updateCart();
});

// Function to view details of a product
function viewProduct(productId) {
  // Find the product in the products array by ID
  const product = products.find(p => p.id === productId);
  // Display an alert with product details
  alert(`Product: ${product.name}\nPrice: ₦${product.price.toFixed(2)}\nDescription: This is a great product.`);
}

// Function to add a product to the cart
function addToCart(productId) {
  // Find the product in the products array by ID
  const product = products.find(p => p.id === productId);
  // Check if the product is already in the cart
  const cartItem = cart.find(item => item.id === productId);
  // If the product is in the cart, increase its quantity; otherwise, add it to the cart
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  // Update the cart display
  updateCart();
}

// Function to update the cart display
function updateCart() {
  // Get the cart items container element
  const cartItemsContainer = document.getElementById('cart-items');
  // Clear previous cart items
  cartItemsContainer.innerHTML = '';
  let totalAmount = 0;
  // Loop through each item in the cart
  cart.forEach(item => {
    // Calculate total price for each item considering its quantity
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    // Generate HTML for each cart item and append it to the cart items container
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
  // Update the total amount and cart count display
  document.getElementById('total-amount').innerText = `₦${totalAmount.toFixed(2)}`;
  document.getElementById('cart-count').innerText = cart.length;
}

// Function to remove an item from the cart
function removeFromCart(productId) {
  // Filter out the item with the specified ID from the cart
  cart = cart.filter(item => item.id !== productId);
  // Update the cart display
  updateCart();
}

// Function to initiate checkout process
function checkout() {
  // Check if the cart is empty
  if (cart.length === 0) {
    alert('Your cart is empty.');
  } else {
    // Calculate total amount to be paid
    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Initiate payment process using Paystack
    payWithPaystack(totalAmount);
  }
}

// Function to handle payment with Paystack
function payWithPaystack(amount) {
  var handler = PaystackPop.setup({
    key: 'your_public_key_here', // Replace with your public key
    email: 'customer@example.com',
    amount: amount * 100, // Amount in kobo (converted from naira)
    currency: 'NGN',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a random reference number
    callback: function(response) {
      alert('Payment successful. Transaction ref is ' + response.reference);
      // Clear the cart and update the cart display after successful payment
      cart = [];
      updateCart();
      $('#cartModal').modal('hide'); // Hide cart modal after checkout
    },
    onClose: function() {
      alert('Payment cancelled.');
    }
  });
  // Open Paystack payment iframe
  handler.openIframe();
}
