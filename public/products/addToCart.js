// Get the "Add to Cart" button element by its ID
const addToCartBtn = document.getElementById('addToCartBtn');

// Get the product ID from the "order" attribute of the button
const productId = addToCartBtn.getAttribute('order');

// Add an event listener to the "Add to Cart" button
addToCartBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the quantity value from the input field and convert it to a number
    const quantity = parseInt(document.getElementById('quantity').value);

    try {
        // Send a POST request to the server to add the item to the cart
        const response = await fetch('/cart/addtocart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Ensures cookies are sent with the request
            body: JSON.stringify({ productId, quantity }) // Send the product ID and quantity in the request body
        });

        // Check if the response is not OK (status code is not in the range 200-299)
        if (!response.ok) {
            throw new Error('Error adding item to cart'); // Throw an error if the request failed
        }

        // Parse the JSON response from the server
        const result = await response.json();
        alert('Item added to cart successfully'); // Show a success message

        loadCart(); // Reload the cart after adding the item
    } catch (error) {
        console.error(error.message); // Log the error message to the console
        alert('Error adding item to cart. Please try again.'); // Show an error message
    }
});