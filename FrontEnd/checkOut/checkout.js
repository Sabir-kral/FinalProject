document.addEventListener("DOMContentLoaded", function () {
    let user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) {
        alert("Please log in first!");
        window.location.href = "index.html";
        return;
    }

    let cartKey = `cart_${user.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total-price");
    const placeOrderButton = document.getElementById("place-order");
    const checkoutForm = document.getElementById("checkout-form");

    if (cart.length === 0) {
        alert("Your cart is empty. Please add products before checkout.");
        window.location.href = "shop.html";
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    subtotalElement.textContent = `${total.toFixed(2)}$`;
    totalElement.textContent = `${total.toFixed(2)}$`;
    const inputs = document.querySelectorAll(".checkout-container input[required]:not([type='submit'])");

    inputs.forEach(input => {
        input.addEventListener("input", function () {
            if (input.checkValidity()) {
                input.style.border = "2px solid green";
            } else {
                input.style.border = "2px solid red";
            }
        });
    });
    placeOrderButton.addEventListener("click", function (event) {
        event.preventDefault();

        let allValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.style.border = "2px solid red";
                allValid = false;
            } else {
                input.style.border = "2px solid green";
            }
        });

        if (!allValid) {
            alert("Please fill in all required fields correctly.");
            return;
        }

        alert("Your order has been placed successfully!");
        localStorage.removeItem(cartKey);
        window.location.href = "../shop/shop.html";
    });
});


