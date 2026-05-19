window.onload = () => {
    updateUI();
};

function updateUI() {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    const names = document.querySelector(".name");
    const personIcon = document.querySelector(".bi-person");
    const logInBtn = document.querySelector(".logIn");
    const logOutBtn = document.querySelector(".logOut");
    
    let adminBtn = document.getElementById("adminPanelBtn");

    if (user && user.username) {
        if (names) {
            names.innerHTML = user.username;
            names.style.display = "inline";
        }
        if (personIcon) personIcon.style.display = "inline";
        if (logOutBtn) logOutBtn.style.display = "inline";
        if (logInBtn) logInBtn.style.display = "none";

        if (user.roles && user.roles.includes("ROLE_ADMIN")) {
            if (!adminBtn && logOutBtn) {
                adminBtn = document.createElement("button");
                adminBtn.id = "adminPanelBtn";
                adminBtn.className = "admin-btn";
                adminBtn.innerText = "Admin Panel";
                adminBtn.onclick = () => window.location.href = "admin.html";
                logOutBtn.parentNode.insertBefore(adminBtn, logOutBtn);
            }
        }
    } else {
        if (names) names.style.display = "none";
        if (personIcon) personIcon.style.display = "none";
        if (logOutBtn) logOutBtn.style.display = "none";
        if (logInBtn) logInBtn.style.display = "inline";
        if (adminBtn) adminBtn.remove();
    }
}

async function sendContact(event) {
    event.preventDefault();
    
    // HTML-də ID olmadığı üçün .inputss içindəki inputları sıralama ilə tuturuq:
    const inputs = document.querySelectorAll(".inputss input");
    
    // inputs[0] -> Name (birinci input)
    // inputs[1] -> Email (ikinci input)
    // inputs[2] -> Phone (üçüncü input)
    // document.getElementById("message") -> Message (çünki bunun ID-si var)

    const request = {
        name: inputs[0].value,
        email: inputs[1].value,
        phone: inputs[2].value,
        message: document.getElementById("message").value
    };

    // Boş qalan xanaları yoxlayaq
    if(!request.name || !request.email || !request.message) {
        alert("Zəhmət olmasa ulduzlu (*) xanaları doldurun.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/contact/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            alert("Mesajınız uğurla bazaya düşdü!");
            // Xanaları təmizləyirik
            inputs[0].value = "";
            inputs[1].value = "";
            inputs[2].value = "";
            document.getElementById("message").value = "";
        } else {
            alert("Xəta baş verdi: " + response.status);
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