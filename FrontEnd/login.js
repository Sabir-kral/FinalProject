let arr  =[]
let form=document.querySelector("form")
form.addEventListener("submit", (event)=>{
event.preventDefault();
let inputs=document.querySelectorAll("input")
let users=JSON.parse(localStorage.getItem("users"));
let findusers= users.find(user=> user.username==inputs[1].value&& user.password==inputs[2].value);
let p = document.querySelector(".p2 ")
if (findusers) {
   p.innerText = "giris ugurludur"
   p.style.color = "green"
   alert("giris ugurludur")
           window.location.href = "index.html"
        //    arr.push(inputs[1].value)
        //    JSON.parse(localStorage.setItem("activeUsers",arr))
           localStorage.setItem("activeUser",JSON.stringify(findusers))
       } else {
           p.innerText = "user tapilmadi"
           p.style.color = "red"
       }

inputs[1].value="";
inputs[2].value="";


})