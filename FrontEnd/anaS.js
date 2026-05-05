window.onload = () => {
    updateUI();
}

function updateUI() {
    let user = JSON.parse(localStorage.getItem("activeUser"));
    let names = document.querySelector(".name");
    let person = document.querySelector(".bi-person");
    let logOut = document.querySelector(".logOut");
    let logIn = document.querySelector(".logIn");

    if (user && user.username) {
        names.innerHTML = user.username;
        names.style.display = "inline-block";
        person.style.display = "inline-block";
        logOut.style.display = "inline-block";
        logIn.style.display = "none";
    } else {
        names.style.display = "none";
        person.style.display = "none";
        logOut.style.display = "none";
        logIn.style.display = "inline-block";
    }
}

function out() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("accessToken");
    window.location.reload(); // Səhifəni yeniləyərək hər şeyi sıfırla
}
function opens(){
    window.location.href = "login.html"
}

function cart() {
    window.open("./cart/cart.html");
}
