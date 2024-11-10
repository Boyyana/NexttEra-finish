document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorMessage = document.getElementById("error-message");
  
    // Handle form submission
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission
  
      // Grab the values from the input fields
      const email = document.getElementById("email-input").value;
      const password = document.getElementById("password-input").value;
  
      // Simple validation - ensure fields are not empty
      if (!email || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        return;
      }
  
      // Send login data to the backend
      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Login successful, redirect to dashboard or home
          window.location.href = "/";
        } else {
          // Display error message from the server
          errorMessage.textContent = result.message;
        }
      } catch (error) {
        console.log("An error occurred:", error);
        // Handle any other errors
        errorMessage.textContent = "An error occurred. Please try again.";
      }
    });
  });
  