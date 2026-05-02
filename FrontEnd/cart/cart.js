document.addEventListener("DOMContentLoaded", function () {
    let user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) {
        alert("Zəhmət olmasa daxil olun!");
        return;
    }

    let cartKey = `cart_${user.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const cartContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal-price");
    const totalElement = document.getElementById("total-price");

    function renderCart() {
        cartContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = `<tr><td colspan="6">Səbət boşdur.</td></tr>`;
            subtotalElement.textContent = "0$";
            totalElement.textContent = "0$";
            return;
        }

        cart.forEach((product, index) => {
            total += product.price * product.quantity;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${product.image}" width="50"></td>
                <td>${product.brand} ${product.model}</td>
                <td>${product.price} $</td>
                <td>
                    <input type="number" class="quantity-input" data-index="${index}" min="1" max="15" value="${product.quantity}">
                </td>
                <td>${(product.price * product.quantity).toFixed(2)} $</td>
                <td><button class="remove-btn" data-index="${index}">X</button></td>
            `;
            cartContainer.appendChild(row);

        });

        subtotalElement.textContent = `${total.toFixed(2)}$`;
        totalElement.textContent = `${total.toFixed(2)}$`;
    }

    document.getElementById("cart-items").addEventListener("input", function (event) {
        if (event.target.classList.contains("quantity-input")) {
            let index = parseInt(event.target.dataset.index);
            let newQuantity = parseInt(event.target.value);
            
            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1;
            } else if (newQuantity > 15) {
                newQuantity = 15;
            }

            cart[index].quantity = newQuantity;
            updateCart();
        }
    });

    document.getElementById("cart-items").addEventListener("click", function (event) {
        const index = parseInt(event.target.dataset.index);
        if (event.target.classList.contains("remove-btn")) removeFromCart(index);
    });

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function updateCart() {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        renderCart();
    }

    renderCart();
});

