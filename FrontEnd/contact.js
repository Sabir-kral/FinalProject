// Səhifə yüklənəndə UI-ı yenilə
window.onload = () => {
    updateUI();
};

function updateUI() {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    const names = document.querySelector(".name");
    const personIcon = document.querySelector(".bi-person");
    const logInBtn = document.querySelector(".logIn");
    const logOutBtn = document.querySelector(".logOut");
    
    // Admin butonu üçün nav daxilində yer açırıq
    const nav = document.querySelector("nav");
    let adminBtn = document.getElementById("adminPanelBtn");

    if (user && user.username) {
        names.innerHTML = user.username;
        names.style.display = "inline";
        personIcon.style.display = "inline";
        logOutBtn.style.display = "inline";
        logInBtn.style.display = "none";

        // ROL YOXLAMASI: Əgər istifadəçi admindirsə butonu göstər
        // Qeyd: Backend-dən gələn data-da 'roles' massivi olmalıdır
        if (user.roles && user.roles.includes("ROLE_ADMIN")) {
            if (!adminBtn) {
                adminBtn = document.createElement("button");
                adminBtn.id = "adminPanelBtn";
                adminBtn.className = "admin-btn";
                adminBtn.innerText = "Admin Panel";
                adminBtn.onclick = () => window.location.href = "admin.html";
                // Log Out-un yanına əlavə et
                logOutBtn.parentNode.insertBefore(adminBtn, logOutBtn);
            }
        }
    } else {
        names.style.display = "none";
        personIcon.style.display = "none";
        logOutBtn.style.display = "none";
        logInBtn.style.display = "inline";
        if (adminBtn) adminBtn.remove();
    }
}
async function sendContact(event) {
    event.preventDefault();
    
    // HTML-dəki inputların dəyərlərini götürürük
    // QEYD: HTML-də inputlara id="contactName", id="contactEmail" və s. əlavə etməlisən
    const request = {
        name: document.getElementById("contactName").value,
        email: document.getElementById("contactEmail").value,
        phone: document.getElementById("contactPhone").value,
        message: document.getElementById("message").value
    };

    try {
        const response = await fetch("http://localhost:8080/api/contact/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            alert("Mesajınız uğurla bazaya düşdü!");
            document.querySelector(".inputss").reset(); // Formu təmizlə
        }
    } catch (error) {
        console.error("Xəta:", error);
    }
}
function out() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("accessToken");
    window.location.reload();
}

function opens() { window.location.href = "./login.html"; }
function openss() { window.location.href = "./user.html"; }
function cart() { window.location.href = "./cart/cart.html"; }