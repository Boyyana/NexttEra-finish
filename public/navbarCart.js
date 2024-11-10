// Function to load the cart for the logged-in user
async function loadCart() {
    try {
        // Send a GET request to the server to fetch the cart data
        const response = await fetch('/cart/getcart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensures cookies are sent with the request
        });

        // Check if the response is not OK (status code is not in the range 200-299)
        if (!response.ok) {
            throw new Error('Error fetching cart'); // Throw an error if the request failed
        }

        // Parse the JSON response from the server
        const cartData = await response.json();
        console.log('Cart:', cartData);

        // Update the UI with the cart data
        document.getElementById("cartTotal").textContent = "$" + cartData.totalPrice;
        updateCartUI(cartData.items);
    } catch (error) {
        console.error(error.message); // Log the error message to the console
    }
}

// Function to update the cart UI
async function updateCartUI(items) {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = ''; // Clear existing items

    // Check if the cart is empty
    if (items.length === 0) {
        document.querySelector('.cart-quantity').innerText = 0; // Update cart quantity to 0
        const emptyMessage = document.createElement('h2');
        emptyMessage.textContent = 'Your cart is empty!';
        emptyMessage.style.color = '#999999';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.marginTop = '20px';

        cartContainer.appendChild(emptyMessage); // Display empty cart message
        return;
    }

    let totalItems = 0; // Initialize total items count

    // Iterate over each item in the cart
    await items.forEach(async (item) => {
        // Fetch product details for each item
        const productResponse = await fetch(`/products/get-product/${item.productId}`);
        const product = await productResponse.json();

        // Create a div element for the cart item
        const itemDiv = document.createElement('div');
        itemDiv.className = 'single-cart clearfix';

        // Create a div element for the product image
        const imgDiv = document.createElement('div');
        imgDiv.className = 'cart-img f-left';
        const img = document.createElement('img');
        img.style.width = '100px';
        img.src = product.images[0]; // Assuming the first image is the main image
        img.alt = product.name;
        imgDiv.appendChild(img);

        // Create a div element for the product details
        const contentDiv = document.createElement('div');
        contentDiv.className = 'cart-content f-left text-start';
        contentDiv.style.display = "grid";
        contentDiv.style.gridTemplateColumns = "(3, 1fr)";
        const productName = document.createElement('h6');
        productName.innerText = product.name;
        const productPrice = document.createElement('span');
        productPrice.className = 'cart-price';
        productPrice.innerText = `Price: $${product.price}`;
        const productQuantity = document.createElement('span');
        productQuantity.className = 'product-quantity';
        productQuantity.innerText = `Quantity: ${item.quantity}`;
        totalItems += item.quantity; // Update total items count
        console.log('Total items:', totalItems);
        document.querySelector('.cart-quantity').innerText = totalItems; // Update cart quantity
        contentDiv.appendChild(productName);
        contentDiv.appendChild(productPrice);
        contentDiv.appendChild(productQuantity);

        // Create a remove button for the cart item
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', async () => {
            await removeFromCart(item.productId); // Remove item from cart
            loadCart(); // Reload the cart after removing the item
        });
        contentDiv.appendChild(removeButton);

        itemDiv.appendChild(imgDiv);
        itemDiv.appendChild(contentDiv);

        cartContainer.appendChild(itemDiv); // Add the cart item to the cart container
    });
}

// Function to remove an item from the cart
async function removeFromCart(productId) {
    try {
        // Send a POST request to the server to remove the item from the cart
        const response = await fetch('/cart/removefromcart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Ensures cookies are sent with the request
            body: JSON.stringify({ productId }) // Send the product ID in the request body
        });

        // Check if the response is not OK (status code is not in the range 200-299)
        if (!response.ok) {
            throw new Error('Error removing item from cart'); // Throw an error if the request failed
        }

        console.log('Item removed from cart');
    } catch (error) {
        console.error(error.message); // Log the error message to the console
    }
}

// Load the cart when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadCart);