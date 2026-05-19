// --- SƏBƏTİ BACKEND-DƏN ÇƏKMƏK ---
async function fetchCart() {
    try {
        const userData = JSON.parse(localStorage.getItem("activeUser"));
        
        if (!userData || !userData.accessToken) {
            console.error("Giriş məlumatları tapılmadı!");
            return;
        }

        const response = await fetch("http://localhost:8080/api/cart/my-cart", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${userData.accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 403) {
            console.error("403 Forbidden: Sizin bu məlumatı görməyə icazəniz yoxdur (Rol problemi).");
            return;
        }

        if (response.ok) {
            const cartItems = await response.json();
            renderCart(cartItems);
        } else {
            console.error("Səbət yüklənmədi. Status:", response.status);
        }
    } catch (error) {
        console.error("Xəta baş verdi:", error);
    }
}

// --- SƏBƏTDƏKİ ELEMENTLƏRİ EKRANA YAZDIRMAQ ---
function renderCart(items) {
    const cartContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal-price");
    const totalElement = document.getElementById("total-price");

    if (!cartContainer) return;

    cartContainer.innerHTML = ""; 
    let total = 0;

    if (!items || items.length === 0) {
        cartContainer.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Səbətiniz boşdur.</td></tr>`;
        if (subtotalElement) subtotalElement.textContent = "0.00 AZN";
        if (totalElement) totalElement.textContent = "0.00 AZN";
        return;
    }

    items.forEach(item => {
        if (!item || !item.product) {
            console.warn("Məhsul məlumatı tapılmayan səbət elementi ötürüldü:", item);
            return; 
        }

        const product = item.product;
        const itemPrice = product.price || 0;
        const itemQuantity = item.quantity || 0;
        const itemTotal = itemPrice * itemQuantity;
        
        total += itemTotal;

        const imgPath = product.image && product.image !== "string" 
            ? `http://localhost:8080/uploads/${product.image}` 
            : "https://placehold.co/50x50?text=No+Photo";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${imgPath}" width="50" style="border-radius:4px;" onerror="this.src='https://placehold.co/50x50'"></td>
            <td>${product.brand || 'Naməlum'} ${product.model || ''}</td>
            <td>${itemPrice.toFixed(2)} AZN</td>
            <td>
                <div class="quantity-control">
                    <input type="number" class="quantity-input" 
                           value="${itemQuantity}" min="1" 
                           onchange="updateQuantity(${product.id}, this.value)">
                </div>
            </td>
            <td>${itemTotal.toFixed(2)} AZN</td>
            <td>
                <button class="remove-btn" onclick="removeItem(${product.id})" style="border:none; background:none; cursor:pointer; color:red; font-weight:bold;">
                    X
                </button>
            </td>
        `;
        cartContainer.appendChild(row);
    });

    if (subtotalElement) subtotalElement.textContent = `${total.toFixed(2)} AZN`;
    if (totalElement) totalElement.textContent = `${total.toFixed(2)} AZN`;
}

// --- SAYI YENİLƏMƏK ---
async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;

    try {
        const userData = JSON.parse(localStorage.getItem("activeUser"));
        const response = await fetch(`http://localhost:8080/api/cart/update?productId=${productId}&quantity=${newQuantity}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${userData.accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            fetchCart();
        } else {
            console.error("Say yenilənmədi");
        }
    } catch (error) {
        console.error("Update xətası:", error);
    }
}

// --- MƏHSULU SİLƏRƏK SƏBƏTİ YENİLƏMƏK ---
async function removeItem(productId) {
    if (!confirm("Bu məhsulu səbətdən silmək istədiyinizə əminsiniz?")) return;

    try {
        const userData = JSON.parse(localStorage.getItem("activeUser"));
        const response = await fetch(`http://localhost:8080/api/cart/remove?productId=${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${userData.accessToken}`
            }
        });

        if (response.ok) {
            fetchCart();
        } else {
            console.error("Məhsul silinmədi");
        }
    } catch (error) {
        console.error("Silmə xətası:", error);
    }
}

// --- ƏSAS KÖPRÜ: PROCEED TO CHECKOUT DÜYMƏSİ SIKILANDA ---
document.addEventListener("DOMContentLoaded", function() {
    // HTML-dəki "Proceed to checkout" düyməsinin ID-sini bura yazırıq
    const proceedBtn = document.getElementById("proceed-to-checkout-btn") || document.querySelector(".checkout-button");

    if (proceedBtn) {
        proceedBtn.addEventListener("click", async function (e) {
            e.preventDefault();
            
            const userData = JSON.parse(localStorage.getItem("activeUser"));
            if (!userData || !userData.accessToken) {
                alert("Zəhmət olmasa əvvəlcə Giriş (Login) edin!");
                window.location.href = "../sign/sign.html";
                return;
            }

            try {
                // Səbəti bağlayıb Sifariş (Order) cədvəlinə transfer edirik
                const response = await fetch("http://localhost:8080/api/orders/convert-from-cart", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${userData.accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    // Transfer uğurludursa, artıq checkout səhifəsinə tam təhlükəsiz keçə bilərik
                    window.location.href = "../checkout/checkout.html";
                } else {
                    alert("Səbətdəki məhsullar sifariş sisteminə köçürülə bilmədi. Status: " + response.status);
                }
            } catch (error) {
                console.error("Xəta:", error);
                alert("Serverlə əlaqə qurularkən xəta yarandı.");
            }
        });
    }
});

// Səhifə ilk dəfə açılanda səbəti yüklə
fetchCart();