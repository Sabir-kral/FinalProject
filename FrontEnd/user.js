let user = JSON.parse(localStorage.getItem("activeUser"));
let names = document.querySelector(".name");
names.innerHTML = user.username;
names.style.display = "inline" ;
let person = document.querySelector(".bi-person") ;
person.style.display = "inline";
let name1 = document.querySelector(".names").innerText = `name:${user.name}`;
let surname = document.querySelector(".surname").innerText = `surname:${user.surname}`;
let emails = document.querySelector(".email").innerText = `email:${user.email}`;
let username = document.querySelector(".username").innerText = `username:${user.username}`;

function opens() {
    window.open("./login.html")
}
function out() {
    person.style.display = "none"
    names.style.display = "none"
    let logOut = document.querySelector(".logOut")
    let logIn = document.querySelector(".logIn")
    logOut.style.display = "none"
    logIn.style.display = "inline"
    localStorage.removeItem("activeUsers")
    logOut.style.display = "none"
}
function openss() {
    window.open("./user.html")
}
function cart() {
    window.open("./cart/cart.html");
}