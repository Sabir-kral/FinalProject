window.onload = () => {
    updateUI();
}

function updateUI() {
    let user = JSON.parse(localStorage.getItem("activeUser"));
    let names = document.querySelector(".name");
    let person = document.querySelector(".bi-person");
    let logOut = document.querySelector(".logOut");
    let logIn = document.querySelector(".logIn");
    
    let adminPanel = document.getElementById("adminBtn"); 

    if (user && user.username) {
        names.innerHTML = user.username;
        names.style.display = "inline-block";
        person.style.display = "inline-block";
        logOut.style.display = "inline-block";
        logIn.style.display = "none";

        const isAdmin = user.roles && user.roles.some(role => role.name === "ROLE_ADMIN");

        if (isAdmin) {
            if (adminPanel) adminPanel.style.display = "inline-block";
        } else {
            if (adminPanel) adminPanel.style.display = "none";
        }

    } else {
        names.style.display = "none";
        person.style.display = "none";
        logOut.style.display = "none";
        logIn.style.display = "inline-block";
        if (adminPanel) adminPanel.style.display = "none";
    }
}

function out() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("accessToken");
    window.location.reload(); 
}
function opens(){
    window.location.href = "login.html"
}
function openss(){
    window.location.href = "user.html"
}

function cart() {
    window.open("./cart/cart.html");
}
