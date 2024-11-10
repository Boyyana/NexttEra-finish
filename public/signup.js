

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // Prevent form from refreshing the page

        // Get the form input values
        const firstname = document.getElementById('firstname-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const repeatPassword = document.getElementById('repeat-password-input').value;

        // Basic validation checks
        if (!firstname || !email || !password || !repeatPassword) {
            errorMessage.textContent = 'Please fill in all fields.';
            return;
        }

        if (password !== repeatPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            return;
        }

        // Prepare the user data to send to the backend
        const userData = {
            username: firstname,
            email: email,
            password: password
        };

        try {
            // Make the POST request to the backend for user registration
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),  // Send the user data in JSON format
            });

            // Check the response from the server
            if (response.status === 201) {
                // Success: Redirect or inform the user
                window.location.href = '/login.html';  // Redirect to login page after successful registration
            } else {
                // Handle the error
                const errorText = await response.text();
                errorMessage.textContent = errorText || 'Error registering user.';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'An unexpected error occurred. Please try again later.';
        }
    });
});
