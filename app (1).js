// Sample Products Database
const products = [
    { id: 1, name: 'Wireless Headphones', price: 99.99, description: 'Premium noise-cancelling headphones', emoji: '🎧' },
    { id: 2, name: 'Smart Watch', price: 199.99, description: 'Feature-rich smartwatch with health tracking', emoji: '⌚' },
    { id: 3, name: 'Laptop Stand', price: 49.99, description: 'Ergonomic adjustable laptop stand', emoji: '💻' },
    { id: 4, name: 'USB-C Cable', price: 19.99, description: 'Fast charging USB-C cable (2m)', emoji: '🔌' },
    { id: 5, name: 'Portable Charger', price: 79.99, description: '20000mAh portable power bank', emoji: '🔋' },
    { id: 6, name: 'Mechanical Keyboard', price: 129.99, description: 'RGB backlit mechanical keyboard', emoji: '⌨️' },
    { id: 7, name: 'Mouse Pad', price: 29.99, description: 'XL gaming mouse pad with RGB', emoji: '🖱️' },
    { id: 8, name: 'Monitor Light Bar', price: 89.99, description: 'Auto-dimming monitor light bar', emoji: '💡' }
];

// Shopping Cart
let cart = [];
let users = {};
let currentUser = null;
let orders = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
});

// Show Section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    if (sectionId === 'products') {
        loadProducts();
    } else if (sectionId === 'cart') {
        loadCart();
    }
}

// Load Products
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-description">${product.description}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        saveCart();
        updateCartCount();
        alert(`${product.name} added to cart!`);
    }
}

// Load Cart
function loadCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty. <a href="#" onclick="showSection(\'products\')">Continue shopping</a></p>';
        document.getElementById('cart-total').textContent = '0.00';
        return;
    }
    
    cartItemsDiv.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <strong>${item.name}</strong>
                <p>Price: $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
            </div>
            <div>
                <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)" style="width: 60px;">
                <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
    });
    
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Update Quantity
function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        loadCart();
    }
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    loadCart();
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('zyntraCart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('zyntraCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        alert('Please login to proceed with checkout.');
        showSection('login');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const order = {
        id: Date.now(),
        user: currentUser,
        items: [...cart],
        total: total,
        date: new Date().toLocaleDateString(),
        status: 'Pending'
    };
    
    orders.push(order);
    localStorage.setItem('zyntraOrders', JSON.stringify(orders));
    
    alert(`Order placed successfully!\nOrder ID: ${order.id}\nTotal: $${total.toFixed(2)}\n\nThank you for shopping with Zyntra!`);
    cart = [];
    saveCart();
    updateCartCount();
    showSection('home');
}

// Handle Contact Form
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // In a real app, this would send to a server
    alert(`Thank you, ${name}! We've received your message and will get back to you at ${email} soon.`);
    
    document.getElementById('contact-form').reset();
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (users[email] && users[email].password === password) {
        currentUser = email;
        alert(`Welcome back, ${email}!`);
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        showSection('home');
    } else {
        alert('Invalid email or password.');
    }
}

// Handle Signup
function handleSignup() {
    const email = prompt('Enter your email:');
    if (!email) return;
    
    if (users[email]) {
        alert('This email is already registered.');
        return;
    }
    
    const password = prompt('Enter a password:');
    if (!password) return;
    
    users[email] = { password: password };
    localStorage.setItem('zyntraUsers', JSON.stringify(users));
    
    alert('Account created successfully! You can now login.');
}

// Load Users from LocalStorage
window.addEventListener('load', function() {
    const savedUsers = localStorage.getItem('zyntraUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    const savedOrders = localStorage.getItem('zyntraOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    loadCart();
});

// Admin Functions
function showAdminProducts() {
    const adminContent = document.getElementById('admin-content');
    let html = '<h3>Products</h3>';
    
    products.forEach(product => {
        html += `<p>${product.id}. ${product.name} - $${product.price.toFixed(2)}</p>`;
    });
    
    adminContent.innerHTML = html;
}

function showAdminOrders() {
    const adminContent = document.getElementById('admin-content');
    
    if (orders.length === 0) {
        adminContent.innerHTML = '<h3>Orders</h3><p>No orders yet.</p>';
        return;
    }
    
    let html = '<h3>Orders</h3>';
    orders.forEach(order => {
        html += `<p><strong>Order ${order.id}</strong> - ${order.user} - $${order.total.toFixed(2)} - ${order.status}</p>`;
    });
    
    adminContent.innerHTML = html;
}