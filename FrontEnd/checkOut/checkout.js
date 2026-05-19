document.addEventListener("DOMContentLoaded", async function () {
    // 1. Aktiv istifadəçini və Tokeni localStorage-dan yoxlayırıq
    let userData = JSON.parse(localStorage.getItem("activeUser"));
    if (!userData || !userData.accessToken) {
        alert("Zəhmət olmasa əvvəlcə Giriş (Login) edin!");
        window.location.href = "../sign/sign.html";
        return;
    }

    const token = userData.accessToken;
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total-price");
    const checkoutForm = document.getElementById("checkout-form");
    
    // Form daxilindəki bütün məcburi input və select elementlərini seçirik
    const inputs = checkoutForm.querySelectorAll("input[required], select[required]");
    
    let cartItems = []; // Backend-dən gələn səbət məhsullarını saxlamaq üçün

    // --- 2. BACKEND-DƏN REAL SƏBƏT MƏLUMATLARINI ÇƏKMƏK (`/api/cart/my-cart`) ---
    try {
        const response = await fetch("http://localhost:8080/api/cart/my-cart", {
            method: "GET",
            headers: { 
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Səbət məlumatları backend-dən alınmadı.");
        }

        cartItems = await response.json();
        
        // Əgər səbət boşdursa alış-verişə yönləndir
        if (!cartItems || cartItems.length === 0) {
            alert("Səbətiniz hazırda boşdur! Shop səhifəsinə yönləndirilirsiniz.");
            window.location.href = "../shop/shop.html";
            return;
        }

        // Qiymətlərin hesablanması (CartResponse strukturuna uyğun)
        let calculatedTotal = cartItems.reduce((sum, item) => {
            let itemPrice = item.price || (item.product ? item.product.price : 0) || 0;
            let itemQuantity = item.quantity || 1;
            return sum + (itemPrice * itemQuantity);
        }, 0);

        // Qiymətləri ekrana AZN ilə yazdırırıq
        if (subtotalElement) subtotalElement.textContent = `${calculatedTotal.toFixed(2)} AZN`;
        if (totalElement) totalElement.textContent = `${calculatedTotal.toFixed(2)} AZN`;

    } catch (error) {
        console.error("Səbət gətirilərkən xəta:", error);
        alert("Səbət yüklənərkən xəta baş verdi: " + error.message);
    }

    // --- 3. İNPUT VALIDASIYASI (REAL-TIME YAŞIL / QIRMIZI ÇƏRÇİVƏ) ---
    inputs.forEach(input => {
        const validateInput = () => {
            if (input.checkValidity() && input.value !== "Choose..." && input.value.trim() !== "") {
                input.style.border = "2px solid green";
            } else {
                input.style.border = "2px solid red";
            }
        };

        input.addEventListener("input", validateInput);
        input.addEventListener("change", validateInput);
        input.addEventListener("blur", validateInput);
    });

    // --- 4. CHECKOUT FORMASI TƏSDİQLƏNƏNDƏ (MƏHSULLARI VƏ SƏBƏTİ SİLMƏK) ---
    checkoutForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let allValid = true;
        
        // Son validasiya yoxlanışı
        inputs.forEach(input => {
            if (!input.checkValidity() || input.value === "Choose..." || input.value.trim() === "") {
                input.style.border = "2px solid red";
                allValid = false;
            } else {
                input.style.border = "2px solid green";
            }
        });

        if (!allValid) {
            alert("Zəhmət olmasa bütün billing (ünvan) və kart məlumatlarını düzgün doldurun.");
            return;
        }

        // --- SİFARİŞİN TAMAMLANMASI, BAZADAN VƏ SƏBƏTDƏN SİLİNMƏSİ ---
        alert("Sifarişiniz uğurla tamamlandı! Məhsullar satın alındı.");

        // Səbətdəki hər bir məhsul üçün dövr başladırıq
        for (const item of cartItems) {
            // CartResponse modelindən asılı olaraq id-ni təyin edirik
            let pId = item.productId || (item.product ? item.product.id : null);
            
            if (pId) {
                // ADDIM A: Məhsulu ümumi bazadan (ProductController-dəki @DeleteMapping) silirik
                try {
                    await fetch(`http://localhost:8080/api/products/${pId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    console.log(`Məhsul bazadan silindi (ID: ${pId})`);
                } catch (productErr) {
                    console.error(`Məhsul bazadan silinərkən xəta (ID: ${pId}):`, productErr);
                }

                // ADDIM B: Məhsulu istifadəçinin səbətindən (CartController-dəki @DeleteMapping) silirik
                try {
                    await fetch(`http://localhost:8080/api/cart/remove?productId=${pId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    console.log(`Məhsul səbətdən silindi (ID: ${pId})`);
                } catch (cartErr) {
                    console.error(`Məhsul səbətdən silinərkən xəta (ID: ${pId}):`, cartErr);
                }
            }
        }

        // LocalStorage-dəki keşləri təmizləyirik
        let cartKey = `cart_${userData.username}`;
        localStorage.removeItem(cartKey);
        localStorage.removeItem("cart");

        // Proses bitəndən sonra birbaşa shop səhifəsinə yönləndiririk
        window.location.href = "../shop/shop.html";
    });
});