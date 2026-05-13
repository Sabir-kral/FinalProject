async function fetchCart() {
    try {
        const userData = JSON.parse(localStorage.getItem("activeUser"));
        
        if (!userData || !userData.accessToken) {
            console.error("Giriş məlumatları tapılmadı!");
            return;
        }

        const response = await fetch("http://localhost:8080/api/cart", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${userData.accessToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
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
fetchCart()