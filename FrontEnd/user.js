async function getUser() {
    const userData = localStorage.getItem("activeUser");
    
    if (!userData) {
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerText = "İstifadəçi Giriş Etməyib";
        return;
    }

    const token = JSON.parse(userData)?.accessToken;

    try {
        const response = await fetch("http://localhost:8080/api/customers/profile", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) {
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerText = "Server Error və ya Token etibarsızdır";
            return;
        }

        const data = await response.json();
        
        document.querySelector(".names").innerText = `name: ${data.name}`;
        document.querySelector(".surname").innerText = `surname: ${data.surname}`;
        document.querySelector(".username").innerText = `username: ${data.username}`;
        document.querySelector(".email").innerText = `email: ${data.email}`;
        
        document.querySelector(".name").innerText = data.name;

    } catch (error) {
        console.error("Xəta:", error);
        document.getElementById("result").innerText = "Bağlantı xətası!";
    }
}

window.onload = getUser;

function out() {
    document.querySelector(".bi-person").style.display = "none"
    localStorage.removeItem("activeUser");
    document.querySelector(".name").style.display = "none";
    document.querySelector(".logOut").style.display = "none";
    document.querySelector(".logIn").style.display = "inline";
    
    // Çıxışdan sonra ana səhifəyə yönləndirmək yaxşı olar
    window.location.href = "./index.html";
}

// Digər opens, openss, cart funksiyaların olduğu kimi qala bilər
function opens() {
    window.open("./login.html")
}

function openss() {
    window.open("./user.html")
}
function cart() {
    window.open("./cart/cart.html");
}