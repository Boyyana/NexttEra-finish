// Function to load the cart for the logged-in user
async function loadCartCheckout() {
    try {
        const response = await fetch('/cart/getcart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensures cookies are sent with the request
        });

        if (!response.ok) {
            throw new Error('Error fetching cart');
        }

        const cartData = await response.json();
        console.log('Cart:', cartData);
        // Update the UI with the cart data
        updateCheckoutUI(cartData.items, cartData.totalPrice);
    } catch (error) {
        console.error(error.message);
    }
}

// Function to update the checkout UI
function updateCheckoutUI(items, totalPrice) {
    const orderContainer = document.getElementById('yourOrder');
    const table = orderContainer.querySelector('table');
    table.innerHTML = ''; // Clear existing items

    if (items.length === 0) {
        const emptyMessage = document.createElement('tr');
        emptyMessage.innerHTML = '<td colspan="3" style="text-align: center;">Your cart is empty!</td>';
        table.appendChild(emptyMessage);
        return;
    }

    items.forEach(async (item) => {
        const productResponse = await fetch(`/products/get-product/${item.productId}`);
        const product = await productResponse.json();

        const itemRow = document.createElement('tr');
        itemRow.innerHTML = `
            <td class="td-title-1">${product.name}</td>
            <td class="td-title-2">x ${item.quantity}</td>
            <td class="td-title-2">$${(product.price * item.quantity).toFixed(2)}</td>
        `;
        table.appendChild(itemRow);
    });

    const subtotalRow = document.createElement('tr');
    subtotalRow.innerHTML = `
        <td class="td-title-1">Cart Subtotal</td>
        <td class="td-title-2"></td>
        <td class="td-title-2">$${totalPrice.toFixed(2)}</td>
    `;
    table.appendChild(subtotalRow);

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td class="order-total">Order Total</td>
        <td class="td-title-2"></td>
        <td class="order-total-price">$${totalPrice.toFixed(2)}</td>
    `;
    table.appendChild(totalRow);
}

// Load the cart when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadCartCheckout);


// Function to load the wishlist for the logged-in user
async function loadWishlist() {
    try {
        const response = await fetch('/cart/getcart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensures cookies are sent with the request
        });

        if (!response.ok) {
            throw new Error('Error fetching wishlist');
        }

        const wishlistData = await response.json();
        console.log('Wishlist:', wishlistData);
        // Update the UI with the wishlist data
        updateWishlistUI(wishlistData.items);
    } catch (error) {
        console.error(error.message);
    }
}

// Function to update the wishlist UI
function updateWishlistUI(items) {
    const wishlistContainer = document.querySelector('.wishlist-content .table-content tbody');
    wishlistContainer.innerHTML = ''; // Clear existing items

    if (items.length === 0) {
        const emptyMessage = document.createElement('tr');
        emptyMessage.innerHTML = '<td colspan="5" style="text-align: center;">Your wishlist is empty!</td>';
        wishlistContainer.appendChild(emptyMessage);
        return;
    }

    items.forEach(async (item) => {
        const productResponse = await fetch(`/products/get-product/${item.productId}`);
        const product = await productResponse.json();

        const itemRow = document.createElement('tr');
        itemRow.innerHTML = `
            <td class="product-thumbnail">
                <div class="pro-thumbnail-img">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
                <div class="pro-thumbnail-info text-start">
                    <h6 class="product-title-2">
                        <a href="#">${product.name}</a>
                    </h6>
                </div>
            </td>
            <td class="product-price">$${product.price.toFixed(2)}</td>
            <td class="product-stock text-uppercase">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
            <td class="product-add-cart">
                <a href="#" title="Add To Cart">
                    <i class="zmdi zmdi-shopping-cart-plus"></i>
                </a>
            </td>
            <td class="product-remove">
                <a href="#" title="Remove" onclick="removeFromWishlist('${item.productId}')">
                    <i class="zmdi zmdi-close"></i>
                </a>
            </td>
        `;
        wishlistContainer.appendChild(itemRow);
    });
}

// Function to remove an item from the wishlist
async function removeFromWishlist(productId) {
    try {
        const response = await fetch('/cart/removefromcart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Ensures cookies are sent with the request
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            throw new Error('Error removing item from wishlist');
        }

        console.log('Item removed from wishlist');
        loadWishlist(); // Reload the wishlist after removing the item
        loadCartCheckout(); // Reload the cart to reflect the changes
    } catch (error) {
        console.error(error.message);
    }
}

// Load the wishlist when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadWishlist);

const applyCouponButton = document.getElementById('applyCouponButton');
const promoCodeInput = document.getElementById('promoCodeInput');

applyCouponButton.addEventListener('click', async () => {
    const promoCode = promoCodeInput.value.trim();

    if (!promoCode) {
        alert('Please enter a promo code.');
        return;
    }

    try {
        const response = await fetch('/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Ensures cookies are sent with the request
            body: JSON.stringify({ promoCode })
        });

        if (!response.ok) {
            throw new Error('Error during checkout');
        }

        const result = await response.json();
        alert(result.message);

        if (result.orderId) {
            loadCartCheckout(); // Reload the cart after successful checkout
            loadWishlist(); // Reload the wishlist after successful checkout
            // Redirect to the order complete page or update the UI accordingly
            window.location.href = `/`;
        }
    } catch (error) {
        console.error(error.message);
        alert('Error during checkout. Please try again.');
    }
});

// Add a delay before setting the event listener on the remove button
setTimeout(() => {
    document.querySelector(".remove-button").addEventListener("click", async () => {
        setTimeout(() => {
            loadCartCheckout(); // Reload the cart after removing the item
            loadWishlist(); // Reload the wishlist after removing the item
        }, 1000); // Delay of 1000 milliseconds (1 second)
    });
}, 1000); // Delay of 1000 milliseconds (1 second)