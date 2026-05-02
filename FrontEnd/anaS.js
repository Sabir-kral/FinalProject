

window.onload = () => {
    let user = JSON.parse(localStorage.getItem("activeUser"));
    let names = document.querySelector(".name");
    let person = document.querySelector(".bi-person");
    let logOut = document.querySelector(".logOut");
    let logIn = document.querySelector(".logIn");

    if(user && user.username){
        names.innerHTML = user.username;
        names.style.display = "inline";
        person.style.display = "inline";
        logOut.style.display = "inline";
        logIn.style.display = "none";
    } else {
        names.style.display = "none";
        person.style.display = "none";
        logOut.style.display = "none";
        logIn.style.display = "inline";
    }
}

function opens() {
    window.open("./login.html");
}

function out() {
    let person = document.querySelector(".bi-person");
    let names = document.querySelector(".name");
    let logOut = document.querySelector(".logOut");
    let logIn = document.querySelector(".logIn");

    person.style.display = "none";
    names.style.display = "none";
    logOut.style.display = "none";
    logIn.style.display = "inline";

    localStorage.removeItem("activeUser"); 
}

function openss() {
    window.open("./user.html");
}

function cart() {
    window.open("./cart/cart.html");
}
