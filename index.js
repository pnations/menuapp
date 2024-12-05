import { menuArray } from "/data.js";

let cart = [];

const menuList = menuArray.map(function(menuItem) {
    return `
    <section class="menu border">
        <span class="item-image">${menuItem.emoji}</span>
        <div class="menu-content">
            <div class="menu-items">
                <span class="item-name">${menuItem.name}</span>
                <span class="item-ingredients">${menuItem.ingredients}</span>
                <span class="item-price">${formatPrice(menuItem.price)}</span>
            </div>
            <button class="add-to-cart-btn" data-id="${menuItem.id}">+</button>
        </div>
    </section>
    `;
}).join('');

const containerEl = document.getElementById("container");
if (containerEl) {
    containerEl.innerHTML = menuList;
}

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-to-cart-btn")) {
        const itemId = e.target.getAttribute("data-id");
        addToCart(itemId);
    } else if (e.target.classList.contains("remove-from-cart-btn")) {
        const itemId = e.target.getAttribute("data-id");
        removeFromCart(itemId);
    } else if (e.target.classList.contains("close")) {
        document.getElementById('payment-modal').style.display = 'none';
    }
});

function addToCart(itemId) {
    const item = menuArray.find(item => item.id == itemId);
    if (item) {
        const existingItem = cart.find(cartItem => cartItem.id == itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...item, quantity: 1});
        }
        updateCartDisplay();
        saveCartToLocalStorage();
    }
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(cartItem => cartItem.id == itemId);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        saveCartToLocalStorage();
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");

    cartItemsContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.classList.add("cart-item");

        listItem.innerHTML = `
                <div class="cart-item-left">
                    <span class="item-name">${item.name}</span>
                    <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
                </div>
                <div class="cart-item-right">
                    <span class="item-price">${formatPrice(item.price)} (${item.quantity})</span>
                </div>
        `;
        fragment.appendChild(listItem);
    });
    cartItemsContainer.appendChild(fragment);

    const totalPrice = calculateTotalPrice();
    const totalPriceEl = document.getElementById("total-price");
    if (totalPriceEl) {
        totalPriceEl.innerHTML = `<div class="total-price-left">Total price:</div>
                                   <div class="total-price-right">${formatPrice(totalPrice)}</div>`;
    }
}

function calculateTotalPrice() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function formatPrice(price) {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

document.getElementById("purchase-btn").addEventListener("click", function() {

    document.getElementById('payment-modal').style.display = 'block';
});

document.getElementById("submit-btn").addEventListener("click", function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;

    const thankYouMessage = `Thanks, ${name}! Your order is on its way!`;

    document.getElementById('payment-modal').style.display = 'none';
    document.getElementById('purchase-btn').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    document.getElementById('total-price').style.display = 'none';
    document.getElementById('container').style.display = 'none';

    const thankYouMessageElement = document.getElementById('thank-you-message');
    thankYouMessageElement.textContent = thankYouMessage;
    thankYouMessageElement.style.display = 'block';

    cart = [];
    updateCartDisplay();
    saveCartToLocalStorage();

});


