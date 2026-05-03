// script.js - Makes all clickable options workable
// Cart functionality, smooth scrolling, mobile menu

// Cart system using localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const cartBtn = document.querySelector('.cart-btn');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBtn.textContent = `🛒 Cart (${count})`;
}

function addToCart(productTitle, productPrice) {
  const existingItem = cart.find(item => item.title === productTitle);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ title: productTitle, price: parseFloat(productPrice.replace('$', '')), quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  // Visual feedback
  const btn = event.target;
  btn.textContent = 'Added! ✓';
  btn.style.background = 'linear-gradient(135deg, #27ae60, #229954)';
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.style.background = '';
  }, 1500);
}

function showCartModal() {
  let total = 0;
  const modalContent = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
        <span>${item.title} x${item.quantity}</span>
        <span>$${itemTotal.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>
      </div>
    `;
  }).join('');

  const modal = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2>Your Cart (${cart.length} items)</h2>
          <button onclick="closeCartModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        ${modalContent || '<p>Your cart is empty</p>'}
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #eee; text-align: right;">
          <strong>Total: $${total.toFixed(2)}</strong>
        </div>
        <div style="margin-top: 1rem; text-align: center;">
          <button onclick="checkout()" style="background: #3498db; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer;">Checkout</button>
          <button onclick="clearCart()" style="background: #95a5a6; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; margin-left: 10px;">Clear Cart</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
}

function closeCartModal() {
  document.querySelector('.cart-modal')?.remove();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartModal(); // Refresh modal
}

function clearCart() {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartModal();
}

function checkout() {
  if (cart.length === 0) return alert('Cart is empty!');
  alert(`Proceeding to checkout with ${cart.reduce((sum, item) => sum + item.quantity, 0)} items totaling $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}!\n\n(In a real app, this would redirect to payment gateway)`);
  clearCart();
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('mobile-open');
}

// Smooth scrolling for anchor links (enhance default)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();

  // Add to cart buttons
  document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const title = productCard.querySelector('.product-title').textContent;
      const price = productCard.querySelector('.product-price').textContent;
      addToCart(title, price);
    });
  });

  // Cart button
  document.querySelector('.cart-btn').addEventListener('click', showCartModal);

  // Mobile hamburger (add button in CSS/media query)
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.innerHTML = '☰';
  hamburger.style.cssText = 'display: none; background: none; border: none; font-size: 1.5rem; color: white; cursor: pointer; padding: 0.5rem;';
  document.querySelector('nav').appendChild(hamburger);
  hamburger.addEventListener('click', toggleMobileMenu);
});

// Listen for mobile styles (use ResizeObserver or simple check)
window.addEventListener('resize', function() {
  const hamburger = document.querySelector('.hamburger');
  if (window.innerWidth <= 768) {
    hamburger.style.display = 'block';
    document.querySelector('.nav-links').style.display = 'none';
  } else {
    hamburger.style.display = 'none';
    document.querySelector('.nav-links').style.display = 'flex';
  }
});

// Initial check
window.dispatchEvent(new Event('resize'));
